/// <reference path="../typings/com.ibm.domino.d.ts" />
/// <reference path="../typings/apache-commons-codec.d.ts" />
/// "use amd"
define(["require", "exports", "json", "util", "log"], function (require, exports, json, util, log) {
    function serializeDocColumns(doc, cols) {
        try {
            var tArr = [];
            var o = {};
            var v = doc.getColumnValues();
            if (!!cols) {
                for (var i = 0; i < v.size(); i++) {
                    o[cols[i]] = v.get(i);
                }
                o["@unid"] = doc.getUniversalID();
                o["@href"] = "/" + doc.getParentDatabase().getFilePath() + "/api/data/collections/name/0/unid" + doc.getUniversalID();
                return json.stringify(o);
            }
            else {
                for (var i = 0; i < v.size(); i++) {
                    tArr.push(v.get(i));
                }
                return json.stringify(tArr);
            }
        }
        catch (e) {
            print(e);
            return json.stringify({ error: e.toString() });
        }
    }
    function f(n) {
        // Format integers to have at least two digits.
        return n < 10
            ? '0' + n
            : n;
    }
    function replacer(key, value) {
        //print(typeof value);
        if (typeof value === "lotus.domino.local.DateTime" || value instanceof java.util.Date) {
            var jd = value instanceof java.util.Date ? value : value.toJavaDate();
            return jd.getUTCFullYear() + '-' +
                f(jd.getUTCMonth() + 1) + '-' +
                f(jd.getUTCDate()) + 'T' +
                f(jd.getUTCHours()) + ':' +
                f(jd.getUTCMinutes()) + ':' +
                f(jd.getUTCSeconds()) + 'Z';
        }
        return value;
    }
    function getDocItems(doc, items) {
        var o = {};
        for (var k in items) {
            o[k] = util.vector2array(doc.getItemValue(k));
            if (o[k].length <= 1)
                o[k] = o[k].length == 0 ? "" : o[k][0];
        }
        return o;
    }
    function serializeEntryColumns(nve, cols, colNames, dbPath, parentColumns, computedColumns, search, searchIn) {
        try {
            nve.setPreferJavaDates(true);
            var tArr = [];
            var o = {};
            var v = nve.getColumnValues();
            var render = true;
            dbPath = dbPath || nve.getDocument().getParentDatabase().getFilePath();
            if (!!cols) {
                for (var i = 0; i < v.size(); i++) {
                    if (search && cols[i] == searchIn) {
                        //log.log(cols[i]);
                        render = (json.stringify(v.get(i)) + "").toLowerCase().indexOf(search) != -1;
                    }
                    //print(cols[i])
                    //print(v.get(i));
                    o[cols[i]] = v.get(i);
                }
                if (!render)
                    return null;
                o["@unid"] = nve.getUniversalID();
                o["@href"] = "/" + dbPath + "/api/data/collections/name/0/unid" + nve.getUniversalID();
                o["@position"] = nve.getPosition(".");
                o["@noteid"] = nve.getNoteID();
                o["@siblings"] = nve.getSiblingCount();
                o["@ftscore"] = nve.getFTSearchScore();
                if (!!parentColumns) {
                    var tempDoc = nve.getDocument();
                    try {
                        o["@parent"] = getDocItems(tempDoc.getParentDatabase().getDocumentByUNID(tempDoc.getParentDocumentUNID()), parentColumns);
                    }
                    catch (e) {
                        print(e);
                        o["@parent"] = { error: e + "" };
                    }
                }
                if (!!computedColumns) {
                    var ccs = {};
                    for (var k in computedColumns) {
                        var ccConfig = computedColumns[k];
                        try {
                            ccs[k] = ccConfig.instance(nve, colNames);
                        }
                        catch (e) {
                            ccs[k] = e + "";
                        }
                    }
                    o["@computed"] = ccs;
                }
                return json.stringify(o, replacer);
            }
            else {
                for (var i = 0; i < v.size(); i++) {
                    if (search && cols[i] == searchIn) {
                        //log.log(cols[i]);
                        render = (json.stringify(v.get(i)) + "").toLowerCase().indexOf(search) != -1;
                    }
                    tArr.push(v.get(i));
                }
                if (!render)
                    return null;
                tArr.push(nve.getUniversalID());
                tArr.push("/" + dbPath + "/api/data/collections/name/0/unid" + nve.getUniversalID());
                tArr.push(nve.getPosition("."));
                tArr.push(nve.getNoteID());
                tArr.push(nve.getSiblingCount());
                tArr.push(nve.getFTSearchScore());
                if (!!parentColumns) {
                    var tempDoc = nve.getDocument();
                    try {
                        tArr.push(getDocItems(tempDoc.getParentDatabase().getDocumentByUNID(tempDoc.getParentDocumentUNID()), parentColumns));
                    }
                    catch (e) {
                        tArr.push({});
                    }
                }
                return json.stringify(tArr, replacer);
            }
        }
        catch (e) {
            print(e);
            return json.stringify({ error: e.toString() });
        }
    }
    function process() {
        var headers = facesContext.getExternalContext().getRequestHeaderMap();
        var response = facesContext.getExternalContext().getResponse();
        var out = response.getOutputStream();
        response.setContentType("application/json; charset=UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        stream(param, out, headers, response);
        facesContext.responseComplete();
        out.close();
    }
    exports.process = process;
    function stream(param, out, headers, response) {
        var db = session.getDatabase(session.getCurrentDatabase().getServer(), param.db);
        if (!db.isOpen()) {
            return { error: "Cannot open target db: " + param.db };
        }
        var nv = db.getView(param.view);
        var tmpentry;
        var resultCount = 0;
        var results = new Array();
        var parentColumns = null;
        var computedColumns = {};
        var rangeHdr = headers["Range"] || headers["X-Range"];
        var dbPath = db.getFilePath();
        var nvn;
        var search = null;
        var searchIn = null;
        if (!!rangeHdr) {
            //print("rangeHdr = " + rangeHdr);
            rangeHdr = rangeHdr.match(/(\w+)[ =](\d+)-(\d+)\/?(\d*)/);
            //print(rangeHdr);
            if (!!rangeHdr) {
                rangeHdr[2] = rangeHdr[2] == "" ? null : parseInt(rangeHdr[2]) + 1;
                rangeHdr[3] = rangeHdr[3] == "" ? null : parseInt(rangeHdr[3]) + 2;
                rangeHdr[4] = rangeHdr[4] == "" ? null : parseInt(rangeHdr[4]);
            }
        }
        var start = rangeHdr === null || rangeHdr[2] === null ? (param.start || 1) : rangeHdr[2];
        var count = rangeHdr === null || rangeHdr[3] === null || rangeHdr[2] === null ? (param.count || 50) : rangeHdr[3] - rangeHdr[2];
        var expandlevel = param.expandlevel ? parseInt(param.expandlevel) : 0;
        if (param.search) {
            log.warn("expandlevel and search are inefficient used simultaneously.");
        }
        ;
        if (expandlevel > 1) {
            expandlevel = 0;
            log.warn("expandlevel can be 0 or 1");
        }
        if (!!param.parentColumns) {
            parentColumns = {};
            var temp = param.parentColumns.split(",");
            for (var i = 0; i < temp.length; i++) {
                parentColumns[temp[i]] = true;
            }
        }
        if (!!param.computedColumns) {
            var temp = fromJson(param.computedColumns);
            for (var i = 0; i < temp.length; i++) {
                var o = temp[i];
                if (!!o.id && !!o.lib && !!o.proc) {
                    o.instance = null;
                    try {
                        o.instance = require(o.lib)[o.proc];
                    }
                    catch (e) {
                        o.error = e.toString();
                    }
                    computedColumns[o.id] = o;
                }
            }
        }
        if (expandlevel) {
            nvn = nv.createViewNavMaxLevel(0);
            resultCount = nvn.getCount();
        }
        else {
            if (!!param.sortcolumn) {
                if (!!param.search) {
                    resultCount = nv.FTSearchSorted(param.search, 500, param.sortcolumn, !!param.sortorder && param.sortorder == "descending" ? false : true, false, false, false);
                }
                else {
                    resultCount = nv.getEntryCount();
                }
            }
            else {
                if (!!param.search) {
                    resultCount = nv.FTSearch(param.search, 500);
                }
                else {
                    resultCount = nv.getEntryCount();
                }
            }
        }
        search = param.search ? param.search.toLowerCase() : null;
        searchIn = param.searchIn ? param.searchIn.toLowerCase() : null;
        //print("entry count = " + nv.getAllEntries().getCount())
        //print("resultCount = " + resultCount);
        count = Math.min(resultCount, count) - 1;
        response.setHeader("Content-Range", "items " + (start - 1) + "-" + (start + count - 1) + "/" + resultCount);
        var nvec;
        if (!!!expandlevel) {
            nvec = nv.getAllEntries();
        }
        var colsVector = nv.getColumns();
        var cols = [];
        var colNames = {};
        //print("column count = " + colsVector.size())
        for (var i = 0; i < colsVector.size(); i++) {
            cols.push(colsVector.get(i).getItemName());
            colNames[colsVector.get(i).getItemName()] = i;
        }
        //print("before writer")
        var writer = new java.io.OutputStreamWriter(out, "UTF-8");
        //print("after writer");
        writer.write("[");
        var needComma = false;
        if (resultCount > 0) {
            if (expandlevel) {
                var nve = nvn.getNth(parseInt(start));
            }
            else {
                var nve = nvec.getNthEntry(parseInt(start));
            }
            var toWrite = serializeEntryColumns(nve, cols, colNames, dbPath, parentColumns, computedColumns, search, searchIn);
            toWrite && writer.write(toWrite);
            for (var i = 0; i < count; i++) {
                if (expandlevel) {
                    tmpentry = nvn.getNext(nve);
                }
                else {
                    tmpentry = nvec.getNextEntry(nve);
                }
                nve.recycle();
                nve = tmpentry;
                if (!!toWrite)
                    needComma = true;
                toWrite = serializeEntryColumns(nve, cols, colNames, dbPath, parentColumns, computedColumns, search, searchIn);
                toWrite && (needComma && writer.write(", "), writer.write(toWrite));
                if (i % 50 == 0) {
                    writer.flush();
                }
                if (!!!nve)
                    break;
            }
        }
        writer.write("]");
        writer.flush();
        writer.close();
    }
    exports.stream = stream;
});

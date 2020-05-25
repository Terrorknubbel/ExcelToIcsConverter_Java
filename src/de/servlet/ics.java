package de.servlet;

import com.google.gson.*;


import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

public class ics {

    private String jsonString;
    private ArrayList<String> summaryArray;
    private ArrayList<String> dtStart;
    private ArrayList<String> description;

    public ics(String jsonString){
        this.jsonString = jsonString;
    }

    public String createIcs(){
        String strDatum = getValue("Datum");
        return strDatum;
    }

    public String getValue(String value){
        JsonParser jsonParser = new JsonParser();
        JsonObject jo = (JsonObject)jsonParser.parse(jsonString);
        JsonElement ele = jo.getAsJsonObject().get(value);
        String str = String.valueOf(ele);
        str = str.substring(1, str.length()-1);
        return str;
    }

    public ArrayList<String> getSummaryArray(){
        return summaryArray;
    }

    public void setSummaryArray(String Summary){
        JsonParser jsonParser = new JsonParser();
        JsonObject jo = (JsonObject)jsonParser.parse(jsonString);
        JsonArray Summarr = jo.getAsJsonArray(Summary);

        ArrayList<String> summaries = new ArrayList<>();

        for (JsonElement sum : Summarr){
            String str = String.valueOf(sum);
            summaries.add(str);
        }

        summaryArray = summaries;
    }



    public ArrayList<String> getDtStart(){
        return dtStart;
    }

    public void setDtStart(String Date, String Time){
        JsonParser jsonParser = new JsonParser();
        JsonObject jo = (JsonObject)jsonParser.parse(jsonString);
        JsonArray jsonArr = jo.getAsJsonArray("Einträge");

        ArrayList<String> arr = new ArrayList<>();

        for(JsonElement j : jsonArr){
            JsonElement datum = j.getAsJsonObject().get(Date);
            String strDatum = String.valueOf(datum);
            strDatum = strDatum.substring(1, strDatum.length()-1);

            JsonElement uhrzeit = j.getAsJsonObject().get(Time);
            String strUhrzeit = String.valueOf(uhrzeit);
            strUhrzeit = strUhrzeit.substring(1, strUhrzeit.length()-1);

            String finalstr = strDatum + "T" + strUhrzeit + "00";
            arr.add(finalstr);

        }

        this.dtStart = arr;
    }

    public ArrayList<String> getDescription(){
        return description;
    }

    public void setDescription(String Einträge){
        JsonParser jsonParser = new JsonParser();
        JsonObject jo = (JsonObject)jsonParser.parse(jsonString);
        JsonArray jsonArr = jo.getAsJsonArray(Einträge);

        ArrayList<String> arr = new ArrayList<>();

        for (JsonElement j : jsonArr) {
            Set<Map.Entry<String, JsonElement>> entries = j.getAsJsonObject().entrySet();//will return members of your object
            StringBuilder str = new StringBuilder();
            for (Map.Entry<String, JsonElement> entry: entries) {
                str.append(entry.getKey());
                str.append(": ");
                str.append(j.getAsJsonObject().get(entry.getKey()));
                str.append(", ");
                //System.out.println(entry.getKey());
                //System.out.println(j.getAsJsonObject().get(entry.getKey()));
            }

            String s = str.toString();
            s = s.substring(0, s.length() -2);
            arr.add(s);
        }

        this.description = arr;
    }


    @Override
    public String toString() {
        StringBuilder data = new StringBuilder("BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN");
        for(int i = 0; i < getSummaryArray().size(); i++){
            data.append("\nBEGIN:VEVENT");
            data.append("\nSummary:" + summaryArray.get(i));
            data.append("\nDTSTART:" + dtStart.get(i));
            data.append("\nDTEND:" + dtStart.get(i));
            data.append("\nDESCRIPTION:" + description.get(i));
            data.append("\nEND:VEVENT");
        }
        data.append("\nEND:VCALENDAR");
        return data.toString();
    }
}

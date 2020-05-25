import com.google.gson.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

public class main {
    static String str ="{\"Einträge\":[{\"Name\":\"Mustermann\",\"Buchungsgegenstand\":\"Büro - Kaumann/-frau für Büromanagement 2019 (19.08.2019-18.08.2022)\",\"Beginn\":\"19.08.2019\",\"Ende\":\"18.08.2022\",\"Lehrjahr\":\"1. Lehrjahr\",\"Wohngruppe\":\"W Haus I / EG Süd    -142\",\"CM\":\"CM musterfrau -413\",\"Ausbilder\":\"Bob der Baumeister\",\"Ausbilderabwesend\":\"Montags nicht da u. 18.10.19, nur Vormittag bis 11.45 einplanen außer Do. bis 15.00 Uhr da\",\"BS\":\"Mi.+Fr.\",\"Praktikum\":\"\",\"Tag\":\"Donnerstag\",\"Datum\":\"14.11.2019\",\"Uhrzeit\":\"13:00\"}]}";

    static String jsonString = "{\"Einträge\":[{\"Name\":\"Mustermann\",\"Buchungsgegenstand\":\"Büro - Kaumann/-frau für Büromanagement 2019 (19.08.2019-18.08.2022)\",\"Beginn\":\"19.08.2019\",\"Ende\":\"18.08.2022\",\"Lehrjahr\":\"1. Lehrjahr\",\"Wohngruppe\":\"W Haus I / EG Süd    -142\",\"CM\":\"CM musterfrau -413\",\"Ausbilder\":\"Bob der Baumeister\",\"Ausbilderabwesend\":\"Montags nicht da u. 18.10.19, nur Vormittag bis 11.45 einplanen außer Do. bis 15.00 Uhr da\",\"BS\":\"Mi.+Fr.\",\"Praktikum\":\"\",\"Tag\":\"Donnerstag\",\"Datum\":\"14.11.2019\",\"Uhrzeit\":\"13:00\"}],\"Summary\":[\"test\"],\"Datum\":\"Datum\",\"Uhrzeit\":\"Uhrzeit\"}";

    public static void main(String[] args) throws IOException {


        //ics2 icsFile = new ics2(jsonString);
        //icsFile.setDtStart("Datum", "Uhrzeit");
        //icsFile.setSummaryArray("Summary");
        //icsFile.setDescription("Einträge");

        //System.out.println(jsonString);
        //System.out.println("");
        //System.out.println(icsFile);
        Path basicPath = Paths.get("C:/JavaProgramming");
        Path newPath = Paths.get("IO/Logs");
//display the paths to the console.
        System.out.println(basicPath.toString());
        System.out.println(newPath.toString());
//Add a path not found in it(adds newPath to basicPath).
        Path basicPath2 = basicPath.resolve(newPath.toString());
//Returns the absolute portion(basicPath).
        Path newPath2 = newPath.resolve(basicPath.toString());
//display the resulting paths to the console.
        System.out.println(basicPath2.toString());
        System.out.println(newPath2.toString());
    }

    public static int recur(int x, int y){
        if (x==0){
            return y;
        }
        return recur(x-1, x+y);
    }

}

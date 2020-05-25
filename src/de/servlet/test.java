package de.servlet;
import com.google.gson.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;


public class test extends HttpServlet {

    static String jsonString = "{\"Einträge\":[{\"Name\":\"Mustermann\",\"Buchungsgegenstand\":\"Büro - Kaumann/-frau für Büromanagement 2019 (19.08.2019-18.08.2022)\",\"Beginn\":\"19.08.2019\",\"Ende\":\"18.08.2022\",\"Lehrjahr\":\"1. Lehrjahr\",\"Wohngruppe\":\"W Haus I / EG Süd    -142\",\"CM\":\"CM musterfrau -413\",\"Ausbilder\":\"Bob der Baumeister\",\"Ausbilderabwesend\":\"Montags nicht da u. 18.10.19, nur Vormittag bis 11.45 einplanen außer Do. bis 15.00 Uhr da\",\"BS\":\"Mi.+Fr.\",\"Praktikum\":\"\",\"Tag\":\"Donnerstag\",\"Datum\":\"14.11.2019\",\"Uhrzeit\":\"13:00\"}],\"Summary\":[\"test\"],\"Datum\":\"Datum\",\"Uhrzeit\":\"Uhrzeit\"}";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");
        String b = request.getParameter("q");

        try{

          /*  PrintWriter out = response.getWriter();
            byte[] bytes = b.getBytes(StandardCharsets.ISO_8859_1);
            String q = new String(bytes, StandardCharsets.UTF_8);
            out.println(q);*/

            System.out.println(b);
            System.out.println("--------------");
            byte[] bytes = b.getBytes(StandardCharsets.ISO_8859_1);
            String q = new String(bytes, StandardCharsets.UTF_8);
            System.out.println(q.charAt(0));
            System.out.println(q.charAt(q.length()-1));

            q = q.replace("\\", "");

            if(q.charAt(0) == '"'){
                System.out.println(q);
                q = q.substring(1, q.length()-1);
            }

            ics icsFile = new ics(q);
            icsFile.setDtStart("Datum", "Uhrzeit");
            icsFile.setSummaryArray("Summary");
            icsFile.setDescription("Einträge");

            String ics = icsFile.toString();

            File directory = new File("../files/");
            if (! directory.exists()){
                directory.mkdir();
                // If you require it to make the entire directory path including parents,
                // use directory.mkdirs(); here instead.
            }

            int ran = new Random().nextInt(10000);
            String path = "../files/";
            String fileBase = "file";
            String ext = ".ics";

            File check = new File(path + fileBase + ran + ext);

            while(check.exists()){
                ran = new Random().nextInt(10000);
                check = new File(path + fileBase + ran + ext);
            }
            System.out.println(check + " created");

            FileWriter myWriter = new FileWriter(path + fileBase + ran + ext);
            myWriter.write(ics);
            myWriter.close();

            response.setContentType("APPLICATION/OCTET-STREAM");
            response.setHeader("Content-Disposition","attachment; filename=file.ics");

            OutputStream out = response.getOutputStream();

            FileInputStream fileInputStream = new FileInputStream(path + fileBase + ran + ext);

            int i;
            while ((i=fileInputStream.read()) != -1) {
                out.write(i);
            }
            System.out.println(check + " sent");
            fileInputStream.close();
            out.close();

            if(check.delete())
            {
                System.out.println(check + " deleted");
            }
        }catch(Exception e){
            PrintWriter out = response.getWriter();
            out.println("No valid json");
            out.println("----------------------");
            out.println(e);
        }

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

      
    }
}

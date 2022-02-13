package com.example.userinterfaceservice;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class LoadApiData {

    @Value("${loadData.apiKey.daily}")
    private String apiKeyDaily;
    @Value("${loadData.apiKey.intraDay}")
    private String apiKeyIntraday;
    @Value("${loadData.apiKey.currentDay}")
    private String apiKeyCurrentDay;

    @Value("${loadData.intraDayInterval}")
    private int intraDayInterval;

    private final String parentDirectory = System.getProperty("user.dir");
    private final String dataFolderPath = parentDirectory + "/src/main/webapp/estock-ui/src/data_and_config/";

    @SuppressWarnings("unchecked")
    public void loadData() {

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode stocksToLoad = objectMapper
                    .readTree(Files.readAllBytes(Paths.get(dataFolderPath + "StockToShow.json")))
                    .get("Stocks");
            for (JsonNode stock : stocksToLoad) {
                loadDailyData(stock.textValue());
            }
            TimeUnit.SECONDS.sleep(61);
            for (JsonNode stock : stocksToLoad) {
                loadIntraDayData(stock.textValue());
            }
            TimeUnit.SECONDS.sleep(61);
            for (JsonNode stock : stocksToLoad) {
                loadCompanyIncomeStatement(stock.textValue());
            }
            TimeUnit.SECONDS.sleep(61);
            for (JsonNode stock : stocksToLoad) {
                loadCompanyOverview(stock.textValue());
            }
            while (true) {
                for (JsonNode stock : stocksToLoad) {
                    loadCurrentDayData(stock.textValue());
                }
                TimeUnit.SECONDS.sleep(12);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    private void callApiAndSaveData(final String apiURL, final String stockName, final String folderName) {
        try {
            URL urlObject = new URL(apiURL);
            HttpURLConnection connection = (HttpURLConnection) urlObject.openConnection();
            connection.setRequestMethod("GET");
            StringBuilder responseBody = new StringBuilder("");
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String currLine = "";
            while ((currLine = bufferedReader.readLine()) != null) {
                responseBody.append(currLine);
            }
            bufferedReader.close();

            JSONObject jsonObject = new JSONObject(responseBody.toString());
            org.json.simple.JSONObject simpleJsonObject = new org.json.simple.JSONObject();

            Set<String> strings = jsonObject.keySet();
            for (String s : strings) {
                simpleJsonObject.put(s, jsonObject.get(s));
            }
            System.out.println("Writing: " + stockName + ".json");
            FileWriter fileWriter = new FileWriter(dataFolderPath + folderName + stockName + ".json");
            fileWriter.flush();
            fileWriter.write(simpleJsonObject.toJSONString());
            fileWriter.close();
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    private void loadDailyData(final String stockName) {
        String apiURL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=" + stockName + "&apikey=" + apiKeyDaily;
        System.out.println("API url: " + apiURL);
        callApiAndSaveData(apiURL, stockName, "TS_Daily/");
    }

    private void loadIntraDayData(final String stockName) {
        Set<Integer> validInterval = new HashSet<>(Arrays.asList(1, 5, 15, 30, 60));
        if (!validInterval.contains(intraDayInterval)) {
            System.out.println("Invalid entry found for IntraDay interval: " + intraDayInterval + " so routing back to default 5 min");
            intraDayInterval = 5;
        }
        String apiURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
                stockName + "&interval=" + intraDayInterval + "min" + "&apikey=" + apiKeyIntraday;
        System.out.println("API url: " + apiURL);
        callApiAndSaveData(apiURL, stockName, "TS_Intraday/");
    }

    private void loadCurrentDayData(String stockName) {
        String apiURL = "https://finnhub.io/api/v1/quote?symbol=" + stockName + "&token=" + apiKeyCurrentDay;
        System.out.println("API url: " + apiURL);
        callApiAndSaveData(apiURL, stockName, "CurrentDay/");
    }

    private void loadCompanyIncomeStatement(String stockName) {
        String apiURL = "https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=" + stockName + "&apikey=" + apiKeyDaily;
        System.out.println("API url: " + apiURL);
        callApiAndSaveData(apiURL, stockName, "Income_Statement/");
    }

    private void loadCompanyOverview(String stockName) {
        String apiURL = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockName + "&apikey=" + apiKeyDaily;
        System.out.println("API url: " + apiURL);
        callApiAndSaveData(apiURL, stockName, "Company_Overview/");
    }
}

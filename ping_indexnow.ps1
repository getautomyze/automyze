$apiKey = "d8a8b11132644ff788cb9ee30ee5eb5a"
$hostUrl = "www.automyze.in"

$body = @{
    host = $hostUrl
    key = $apiKey
    keyLocation = "https://$hostUrl/$apiKey.txt"
    urlList = @(
        "https://$hostUrl/",
        "https://$hostUrl/services",
        "https://$hostUrl/use-cases",
        "https://$hostUrl/process",
        "https://$hostUrl/case-studies",
        "https://$hostUrl/faq",
        "https://$hostUrl/ai-for-logistics",
        "https://$hostUrl/ai-for-real-estate",
        "https://$hostUrl/ai-for-clinics",
        "https://$hostUrl/ai-for-solar",
        "https://$hostUrl/ai-for-manufacturing",
        "https://$hostUrl/ai-for-service-businesses",
        "https://$hostUrl/ai-for-lead-management",
        "https://$hostUrl/ai-for-whatsapp-business",
        "https://$hostUrl/ai-for-customer-support",
        "https://$hostUrl/ai-for-document-processing",
        "https://$hostUrl/ai-for-appointment-booking",
        "https://$hostUrl/ai-for-quotation-generation",
        "https://$hostUrl/ai-for-back-office-operations",
        "https://$hostUrl/ai-for-team-productivity"
      )
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" -Method Post -Body $body -ContentType "application/json"
Write-Output "IndexNow ping completed. API response: $response"

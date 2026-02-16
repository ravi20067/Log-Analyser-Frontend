import { useEffect, useState } from "react";
import { Key, Copy, Server, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateApiKey,
  getMyApiKey,
  deleteApiKey,
  ApiKeyResponse,
} from "@/api/apiKeyService";

const ApiAccess = () => {
  const [apiData, setApiData] = useState<ApiKeyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);


  // Fetch existing key
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const data = await getMyApiKey();
        setApiData(data);
      } catch (error) {
        console.log("No key found");
      } finally {
        setLoading(false);
      }
    };

    fetchKey();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      // artificial delay for animation effect
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const data = await generateApiKey();
      setApiData(data);
    } finally {
      setGenerating(false);
    }
  };


  const handleDelete = async () => {
    if (!apiData) return;

    try {
      setDeleting(true);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await deleteApiKey(apiData.id);
      setApiData(null);
    } finally {
      setDeleting(false);
    }
  };


  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          API Key Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your secure API credentials to connect your server with CyberShield.
        </p>
      </div>

      {!apiData ? (
        <div className="glass-card p-8 text-center space-y-6">
          <Server size={40} className="mx-auto text-primary" />

          <h2 className="text-xl font-semibold">
            Generate API Credentials
          </h2>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="gap-2 transition-all duration-500"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Key size={18} />
                Generate API Key
              </>
            )}
          </Button>

        </div>
      ) : (
        <>
          {/* API Card */}
          <div className={`glass-card p-6 space-y-6 transition-all duration-700 ${generating || deleting ? "opacity-50 scale-95" : "opacity-100 scale-100"
            }`}>


            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Your API Credentials
              </h2>

              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
                className="gap-2 transition-all duration-500"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash size={16} />
                    Delete
                  </>
                )}
              </Button>

            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                API Key
              </label>

              <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border">
                <code className="text-sm break-all">
                  {apiData.apiKey}
                </code>

                <button onClick={() => copyToClipboard(apiData.apiKey)}>
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Secret */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Secret Key
              </label>

              <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border">
                <code className="text-sm text-destructive break-all">
                  {apiData.secretKey}
                </code>

                <button onClick={() => copyToClipboard(apiData.secretKey)}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* API Usage */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              How To Call API
            </h2>

            <div className="bg-black/40 border rounded-lg p-4">
              <pre className="text-xs whitespace-pre-wrap">
                {`GET "http://localhost:7777/services/${apiData.apiKey}/${apiData.secretKey}"

Headers:
  Content-Type: application/json

Body:
{
  "ip": "192.0.2.10",
  "method": "POST",
  "protocol": "HTTP/1.1",
  "referrer": "-",
  "responseSize": 532,
  "statusCode": 401,
  "timestamp": "13/Feb/2026:13:00:01 +0000",
  "url": "/login",
  "userAgent": "Mozilla/5.0"
}





Response :
{
  "attackName": "Command Injection",
  "riskScore": 98,
  "riskLevel": "CRITICAL",
  "mitre": [
    "Command Injection"
  ],
  "killChainStages": [
    {
      "stage": "Post_Exploitation_Maintaining_Access_Objectives",
      "desc": "Execute OS command remotely",
      "status": "CRITICAL"
    }
  ],
  "affectedAreas": [
    {
      "area": "Server Operating System",
      "impact": 95
    }
  ],
  "radarData": [
    {
      "subject": "Remote Command Execution",
      "A": 92
    }
  ],
  "timelineData": [
    {
      "time": "18:05:01",
      "events": 10
    }
  ],
  "riskPie": [
    {
      "name": "Critical",
      "value": 10,
      "color": "#ef4444"
    }
  ],
  "indicators": [
    {
      "type": "Message",
      "value": "203.0.113.230 - - [14/Feb/2026:18:05:01 +0000] \"GET /ping.php?ip=127.0.0.1;whoami HTTP/1.1\" 500 812 \"-\" \"Mozilla/5.0\"",
      "severity": "CRITICAL"
    }
  ],
  "incidentResponse": [
    "Patch server"
  ],
  "sourcefileId": "69921e0db57a2109d8e94a72",
  "email": "kumarr3829@gmail.com",
  "_class": "com.security.LogsAnalyser.Entity.AnalysisResponse"
}`}

              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiAccess;

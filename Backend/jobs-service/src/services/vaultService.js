require("dotenv").config();

const getSecrets = async () => {
  async function getHcpToken() {
    try {
      const response = await fetch(
        "https://auth.idp.hashicorp.com/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.HCP_CLIENT_ID,
            client_secret: process.env.HCP_CLIENT_SECRET,
            grant_type: "client_credentials",
            audience: "https://api.hashicorp.cloud",
          }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(
        "Error fetching HCP API Token:",
        error.response?.data || error.message
      );
      return null;
    }
  }

  try {
    const token = await getHcpToken();

    if (!token) {
      throw new Error("Failed to get API token");
    }

    const baseUrl =
      "https://api.cloud.hashicorp.com/secrets/2023-11-28/organizations/2cca24f6-708f-4033-9a29-a82fbf551487/projects/0d66ba1f-ad11-4b52-8b74-71eade9fbc56/apps/Job-Seeker/secrets:open";

    const response = await fetch(baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const secrets = await response.json();

    secrets.secrets.forEach((secret) => {
      const secretValue = secret.static_version?.value;
      process.env[secret.name] = secretValue;
    });
  } catch (error) {
    console.error(
      "Error fetching secrets:",
      error.response?.data || error.message
    );
  }
};

module.exports = { getSecrets };

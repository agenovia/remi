import axios from "axios";

class Secret {
  secret: {};
  name: string;
  value: string;

  constructor(secret: { name: string; version?: any }) {
    this.secret = secret;
    this.name = secret.name;
    this.value = secret.version.value;
  }
}

class Vault {
  private clientId: string;
  private clientSecret: string;
  private vaultURL: string;

  constructor(clientId: string, clientSecret: string, vaultURL: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.vaultURL = vaultURL;
  }

  private fetchPrincipalToken = async () => {
    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);
    params.append("grant_type", "client_credentials");
    params.append("audience", "https://api.hashicorp.cloud");

    try {
      const d = await axios.post(
        "https://auth.idp.hashicorp.com/oauth2/token",
        params
      );
      return d.data.access_token;
    } catch (err) {
      console.error(err);
    }
  };

  fetchSecret = async (name: string) => {
    const token = await this.fetchPrincipalToken();

    try {
      const res = await axios.get(this.vaultURL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return new Secret(
        res.data.secrets.filter((d: { name: string }) => d.name === name).pop(1)
      );
    } catch (err) {
      console.error(err);
    }
  };
}

export default Vault;

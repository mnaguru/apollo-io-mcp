import { Router, Response } from "express";
import { supabase } from "../index.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { getUserApiKey } from "./api-keys.js";
import { request } from "undici";

export const apolloRouter = Router();

apolloRouter.use(authMiddleware);

class ApolloClient {
  constructor(private apiKey: string, private baseUrl: string = "https://api.apollo.io/api/v1") {}

  private async post<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (res.statusCode === 401) {
      throw new Error("Unauthorized: invalid or missing APOLLO_API_KEY");
    }
    if (res.statusCode === 429) {
      const retryAfter = res.headers["retry-after"];
      throw new Error(`Rate limited by Apollo (429).${retryAfter ? ` Retry after ${retryAfter}s.` : ""}`);
    }
    if (res.statusCode >= 400) {
      const text = await res.body.text();
      throw new Error(`Apollo error ${res.statusCode}: ${text}`);
    }

    return (await res.body.json()) as T;
  }

  private async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey
      }
    });

    if (res.statusCode >= 400) {
      const text = await res.body.text();
      throw new Error(`Apollo error ${res.statusCode}: ${text}`);
    }

    return (await res.body.json()) as T;
  }

  searchPeople(params: Record<string, unknown>) {
    return this.post("/mixed_people/search", params);
  }

  searchCompanies(params: Record<string, unknown>) {
    return this.post("/mixed_companies/search", params);
  }

  matchPerson(params: Record<string, unknown>) {
    const queryParams = new URLSearchParams({
      reveal_personal_emails: 'false',
      reveal_phone_number: 'false'
    });
    return this.post(`/people/match?${queryParams}`, params);
  }

  matchCompany(params: Record<string, unknown>) {
    return this.post("/organizations/enrich", params);
  }

  bulkEnrichPeople(params: Record<string, unknown>) {
    return this.post("/people/bulk_match", params);
  }

  bulkEnrichOrganizations(params: Record<string, unknown>) {
    return this.post("/organizations/bulk_enrich", params);
  }

  getOrganizationJobPostings(orgId: string) {
    return this.get(`/organizations/${orgId}/job_postings`);
  }

  getCompleteOrganizationInfo(orgId: string) {
    return this.get(`/organizations/${orgId}`);
  }

  searchNewsArticles(params: Record<string, unknown>) {
    return this.post("/news_articles/search", params);
  }
}

async function saveToHistory(userId: string, toolName: string, queryParams: any, resultCount: number) {
  try {
    await supabase.from("search_history").insert({
      user_id: userId,
      tool_name: toolName,
      query_params: queryParams,
      result_count: resultCount
    });
  } catch (error) {
    console.error("Failed to save search history:", error);
  }
}

apolloRouter.post("/search-people", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.searchPeople(req.body);

    await saveToHistory(req.userId!, "search_people", req.body, result.pagination?.total_entries || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/search-companies", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.searchCompanies(req.body);

    await saveToHistory(req.userId!, "search_companies", req.body, result.pagination?.total_entries || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/enrich-person", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result = await apollo.matchPerson(req.body);

    await saveToHistory(req.userId!, "enrich_person", req.body, 1);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/enrich-company", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result = await apollo.matchCompany(req.body);

    await saveToHistory(req.userId!, "enrich_company", req.body, 1);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/bulk-enrich-people", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.bulkEnrichPeople(req.body);

    await saveToHistory(req.userId!, "bulk_enrich_people", req.body, result.matches?.length || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/bulk-enrich-organizations", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.bulkEnrichOrganizations(req.body);

    await saveToHistory(req.userId!, "bulk_enrich_organizations", req.body, result.matches?.length || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.get("/organization/:id/jobs", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.getOrganizationJobPostings(req.params.id);

    await saveToHistory(req.userId!, "organization_jobs", { organization_id: req.params.id }, result.job_postings?.length || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.get("/organization/:id", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result = await apollo.getCompleteOrganizationInfo(req.params.id);

    await saveToHistory(req.userId!, "organization_info", { organization_id: req.params.id }, 1);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apolloRouter.post("/search-news", async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = await getUserApiKey(req.userId!);
    if (!apiKey) {
      return res.status(400).json({ error: "Apollo API key not configured" });
    }

    const apollo = new ApolloClient(apiKey);
    const result: any = await apollo.searchNewsArticles(req.body);

    await saveToHistory(req.userId!, "search_news", req.body, result.pagination?.total_entries || 0);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

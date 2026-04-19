(function () {
  const config = window.PORTFOLIO_CONFIG || {};

  function normalizeProject(item) {
    return {
      ...item,
      tags: Array.isArray(item.tags) ? item.tags : [],
      github: item.github || "",
      demo: item.demo || "",
      icon: item.icon || "fa-code",
      published: item.published !== false
    };
  }

  function normalizeCertification(item) {
    return {
      ...item,
      issuedAt: item.issuedAt || item.issued_at || "",
      skills: Array.isArray(item.skills) ? item.skills : [],
      icon: item.icon || "fa-certificate"
    };
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load " + path);
    }

    return response.json();
  }

  async function fetchSupabaseTable(table) {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error("Supabase is not configured");
    }

    const response = await fetch(
      config.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + table + "?select=*",
      {
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: "Bearer " + config.supabaseAnonKey
        }
      }
    );

    if (!response.ok) {
      throw new Error("Supabase request failed for " + table);
    }

    return response.json();
  }

  async function loadProjects() {
    if (config.contentSource === "supabase") {
      const items = await fetchSupabaseTable(config.supabaseProjectsTable || "projects");
      return items
        .filter((item) => item.published !== false)
        .map(normalizeProject);
    }

    const data = await fetchJson("data/projects.json");
    return (data.projects || [])
      .filter((item) => item.published !== false)
      .map(normalizeProject);
  }

  async function loadCertifications() {
    if (config.contentSource === "supabase") {
      const items = await fetchSupabaseTable(config.supabaseCertificatesTable || "certifications");
      return items.map(normalizeCertification);
    }

    const data = await fetchJson("data/certifications.json");
    return (data.certifications || []).map(normalizeCertification);
  }

  window.PortfolioContentStore = {
    loadProjects,
    loadCertifications
  };
})();

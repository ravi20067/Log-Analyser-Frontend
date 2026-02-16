import { useState } from "react";
import { BookOpen, Plus, ArrowLeft, User, Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  isUserPost: boolean;
}

const defaultArticles: Article[] = [
  {
    id: 1, title: "Understanding the Cyber Kill Chain Framework", author: "Dr. Sarah Chen",
    date: "Dec 10, 2024", category: "Framework", readTime: "8 min", isUserPost: false,
    excerpt: "The Cyber Kill Chain is a framework developed by Lockheed Martin to identify and prevent cyber intrusions...",
    content: `The Cyber Kill Chain is a framework developed by Lockheed Martin to identify and prevent cyber intrusions activity. It outlines 7 stages of a cyberattack:\n\n1. **Reconnaissance** — Harvesting email addresses, conference information, etc.\n2. **Weaponization** — Coupling exploit with backdoor into deliverable payload.\n3. **Delivery** — Delivering weaponized bundle via email, web, USB, etc.\n4. **Exploitation** — Exploiting a vulnerability to execute code on victim's system.\n5. **Installation** — Installing malware on the asset.\n6. **Command & Control** — Command channel for remote manipulation of victim.\n7. **Actions on Objectives** — Accomplishing the original goals of the intrusion.\n\nUnderstanding each stage helps defenders build layered defenses and detect attacks earlier in the chain.`,
  },
  {
    id: 2, title: "Ransomware Defense Strategies for 2025", author: "Mike Rodriguez",
    date: "Dec 8, 2024", category: "Defense", readTime: "12 min", isUserPost: false,
    excerpt: "With ransomware attacks increasing 150% year-over-year, organizations need robust defense strategies...",
    content: `Ransomware continues to be one of the most devastating cyber threats.\n\n**Backup Strategy (3-2-1 Rule)**\n- 3 copies of data\n- 2 different storage types\n- 1 offsite copy\n\n**Network Segmentation**\nIsolate critical systems to prevent lateral movement.\n\n**Endpoint Detection and Response (EDR)**\nDeploy EDR solutions that can detect ransomware behavior patterns.\n\n**Zero Trust Architecture**\nNever trust, always verify. Implement least-privilege access controls.`,
  },
  {
    id: 3, title: "MITRE ATT&CK: A Practical Guide", author: "Alex Thompson",
    date: "Dec 5, 2024", category: "Framework", readTime: "10 min", isUserPost: false,
    excerpt: "MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques...",
    content: `MITRE ATT&CK describes cyber adversary behavior.\n\n**Key Components:**\n- **Tactics** — The "why"\n- **Techniques** — The "how"\n- **Procedures** — Specific implementations\n\n**Using ATT&CK for Defense:**\n1. Map current detections to techniques\n2. Identify coverage gaps\n3. Prioritize detection engineering\n4. Use threat intel to focus efforts\n5. Conduct purple team exercises`,
  },
  {
    id: 4, title: "Log Analysis Best Practices", author: "Priya Patel",
    date: "Dec 3, 2024", category: "Analysis", readTime: "6 min", isUserPost: false,
    excerpt: "Effective log analysis is the cornerstone of threat detection and incident response...",
    content: `Effective log analysis requires a systematic approach:\n\n**Centralized Logging**\nUse a SIEM to aggregate logs from all sources.\n\n**Key Log Sources:**\n- Web server logs\n- Firewall and IDS/IPS logs\n- Authentication logs\n- DNS query logs\n\n**Analysis Techniques:**\n1. Baseline normal behavior\n2. Look for anomalies\n3. Correlate events across sources\n4. Use regex for pattern matching\n5. Automate common tasks`,
  },
];

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleAddBlog = () => {
    if (!newTitle || !newContent) return;
    setArticles([
      {
        id: Date.now(), title: newTitle, author: "You", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        category: newCategory || "General", readTime: `${Math.ceil(newContent.split(" ").length / 200)} min`,
        excerpt: newContent.slice(0, 120) + "...", content: newContent, isUserPost: true,
      },
      ...articles,
    ]);
    setNewTitle(""); setNewContent(""); setNewCategory(""); setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter(a => a.id !== id));
    setConfirmDelete(null);
    if (selectedArticle?.id === id) setSelectedArticle(null);
  };

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft size={16} /> Back to articles
          </button>
          {selectedArticle.isUserPost && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(selectedArticle.id)}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          )}
        </div>
        <div className="glass-card p-6">
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{selectedArticle.category}</span>
          <h1 className="font-heading text-2xl font-bold mt-3">{selectedArticle.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><User size={14} /> {selectedArticle.author}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {selectedArticle.readTime}</span>
            <span>{selectedArticle.date}</span>
          </div>
          <div className="mt-6 text-foreground leading-relaxed whitespace-pre-line text-sm">
            {selectedArticle.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-primary">Blog & Articles</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary text-primary-foreground">
          <Plus size={16} className="mr-2" /> Add Blog
        </Button>
      </div>

      {showAddForm && (
        <div className="glass-card p-5 animate-fade-in space-y-3">
          <h3 className="font-heading text-lg font-semibold">Write New Article</h3>
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Article Title" className="bg-secondary border-border" />
          <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category (e.g., Defense, Analysis)" className="bg-secondary border-border" />
          <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="Write your article..." rows={8} className="bg-secondary border-border" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-border">Cancel</Button>
            <Button onClick={handleAddBlog} className="bg-primary text-primary-foreground">Publish</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="glass-card p-5 hover:cyber-box-glow transition-all relative group">
            {/* Delete button for user posts */}
            {article.isUserPost && (
              <>
                {confirmDelete === article.id ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1 z-10 bg-card rounded-md p-1 border border-border animate-fade-in">
                    <button onClick={() => handleDelete(article.id)} className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30">Delete</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(article.id); }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </>
            )}
            <button onClick={() => setSelectedArticle(article)} className="text-left w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{article.category}</span>
                {article.isUserPost && <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">Your post</span>}
              </div>
              <h3 className="font-heading text-lg font-semibold mt-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                <span>{article.date}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

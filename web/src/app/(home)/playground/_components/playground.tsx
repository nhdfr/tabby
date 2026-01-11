"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generate, PLACEHOLDERS } from "@/lib/generator";
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type HttpMethod = "GET" | "POST";

interface FormField {
  id: string;
  key: string;
  type: string;
  value: string;
  isCustom: boolean;
}

interface PlaygroundState {
  method: HttpMethod;
  baseUrl: string;
  path: string;
  contentType: string;
  formFields: FormField[];
  rawBody: string;
  bodyMode: "form" | "raw";
  loopEnabled: boolean;
  loopCount: string;
  interval: string;
}

const STORAGE_KEY = "tabby-playground-state";
const BANNER_DISMISSED_KEY = "tabby-install-banner-dismissed";

const CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
  "application/xml",
];

const FIELD_TYPES = ["string", "number", "boolean", "array"];

const defaultState: PlaygroundState = {
  method: "POST",
  baseUrl: "https://api.example.com",
  path: "/users",
  contentType: "application/json",
  formFields: [
    {
      id: "1",
      key: "name",
      type: "string",
      value: "{{name}}",
      isCustom: false,
    },
    {
      id: "2",
      key: "email",
      type: "string",
      value: "{{email}}",
      isCustom: false,
    },
    {
      id: "3",
      key: "phone",
      type: "string",
      value: "{{phone}}",
      isCustom: false,
    },
  ],
  rawBody: '{\n  "name": "{{name}}",\n  "email": "{{email}}"\n}',
  bodyMode: "form",
  loopEnabled: false,
  loopCount: "10",
  interval: "1s",
};

export function Playground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const [method, setMethod] = useState<HttpMethod>(defaultState.method);
  const [baseUrl, setBaseUrl] = useState(defaultState.baseUrl);
  const [path, setPath] = useState(defaultState.path);
  const [contentType, setContentType] = useState(defaultState.contentType);
  const [formFields, setFormFields] = useState<FormField[]>(
    defaultState.formFields,
  );
  const [rawBody, setRawBody] = useState(defaultState.rawBody);
  const [bodyMode, setBodyMode] = useState<"form" | "raw">(
    defaultState.bodyMode,
  );
  const [loopEnabled, setLoopEnabled] = useState(defaultState.loopEnabled);
  const [loopCount, setLoopCount] = useState(defaultState.loopCount);
  const [interval, setInterval] = useState(defaultState.interval);

  const [copied, setCopied] = useState(false);
  const [outputTab, setOutputTab] = useState("tabby");
  const [templateCount, setTemplateCount] = useState(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: PlaygroundState = JSON.parse(saved);
        setMethod(state.method);
        setBaseUrl(state.baseUrl);
        setPath(state.path);
        setContentType(state.contentType);
        setFormFields(state.formFields);
        setRawBody(state.rawBody);
        setBodyMode(state.bodyMode);
        setLoopEnabled(state.loopEnabled);
        setLoopCount(state.loopCount);
        setInterval(state.interval);
      }

      const bannerDismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
      if (!bannerDismissed) {
        setShowBanner(true);
      }

      const count = localStorage.getItem("tabby-template-count");
      if (count) setTemplateCount(parseInt(count, 10));
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const state: PlaygroundState = {
        method,
        baseUrl,
        path,
        contentType,
        formFields,
        rawBody,
        bodyMode,
        loopEnabled,
        loopCount,
        interval,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [
    isLoaded,
    method,
    baseUrl,
    path,
    contentType,
    formFields,
    rawBody,
    bodyMode,
    loopEnabled,
    loopCount,
    interval,
  ]);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(BANNER_DISMISSED_KEY, "true");
    } catch {}
  };

  const fullUrl = `${baseUrl}${path}`;

  const formBodyJson = useMemo(() => {
    const obj: Record<string, unknown> = {};
    formFields.forEach((f) => {
      if (f.key.trim()) {
        const isPlaceholder = f.value.startsWith("{{") && f.value.endsWith("}}");
        if (f.type === "number") {
          // For number type: use placeholder as-is (will be unquoted) or parse as number
          if (isPlaceholder) {
            obj[f.key] = f.value; // Will be handled specially in JSON output
          } else {
            obj[f.key] = Number(f.value) || 0;
          }
        } else if (f.type === "boolean") {
          // For boolean type: use placeholder as-is or parse as boolean
          if (isPlaceholder) {
            obj[f.key] = f.value; // Will be handled specially in JSON output
          } else {
            obj[f.key] = f.value === "true";
          }
        } else {
          obj[f.key] = f.value;
        }
      }
    });
    
    // Custom stringify to handle unquoted placeholders for number/boolean fields
    const jsonStr = JSON.stringify(obj, null, 2);
    // Replace quoted placeholders with unquoted ones for number/boolean types
    let result = jsonStr;
    formFields.forEach((f) => {
      if (f.key.trim() && (f.type === "number" || f.type === "boolean")) {
        const isPlaceholder = f.value.startsWith("{{") && f.value.endsWith("}}");
        if (isPlaceholder) {
          // Replace "{{placeholder}}" with {{placeholder}} (remove quotes)
          result = result.replace(`"${f.value}"`, f.value);
        }
      }
    });
    return result;
  }, [formFields]);

  const effectiveBody = useMemo(() => {
    if (method === "GET") return "";
    return bodyMode === "raw" ? rawBody : formBodyJson;
  }, [method, bodyMode, rawBody, formBodyJson]);

  const buildTabbyCommand = useCallback(() => {
    const parts = ["tabby", method.toLowerCase(), `"${fullUrl}"`];
    if (method === "POST" && effectiveBody.trim()) {
      const compact = effectiveBody.replace(/\n/g, " ").replace(/\s+/g, " ");
      parts.push(`\\\n  -d '${compact}'`);
      // Only add content-type if it's not the default (application/json)
      if (contentType !== "application/json") {
        parts.push(`\\\n  -H "${contentType}"`);
      }
    }
    if (loopEnabled) {
      parts.push(`\\\n  --loop --count ${loopCount} --interval ${interval}`);
    }
    return parts.join(" ");
  }, [
    method,
    fullUrl,
    effectiveBody,
    contentType,
    loopEnabled,
    loopCount,
    interval,
  ]);

  const buildCurlCommand = useCallback(() => {
    const parts = [`curl -X ${method} "${fullUrl}"`];
    if (method === "POST" && effectiveBody.trim()) {
      parts.push(`\\\n  -H "Content-Type: ${contentType}"`);
      const compact = effectiveBody.replace(/\n/g, " ").replace(/\s+/g, " ");
      parts.push(`\\\n  -d '${compact}'`);
    }
    return parts.join(" ");
  }, [method, fullUrl, effectiveBody, contentType]);

  const generatedPreview = useMemo(() => {
    if (!effectiveBody.trim()) return "{}";
    try {
      const result = generate(effectiveBody);
      return JSON.stringify(JSON.parse(result), null, 2);
    } catch {
      return generate(effectiveBody);
    }
  }, [effectiveBody]);

  const copyCommand = async () => {
    const cmd =
      outputTab === "tabby" ? buildTabbyCommand() : buildCurlCommand();
    try {
      await navigator.clipboard.writeText(cmd.replace(/\\\n\s+/g, " "));
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadTemplate = () => {
    const templateContent = `// Endpoint: ${fullUrl}
// Method: ${method}
// Content-Type: ${contentType}
// Usage: tabby post "${fullUrl}" -t template.jsonc

${effectiveBody || "{}"}
`;
    const blob = new Blob([templateContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabby-template-${templateCount}.jsonc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const newCount = templateCount + 1;
    setTemplateCount(newCount);
    try {
      localStorage.setItem("tabby-template-count", newCount.toString());
    } catch {}

    toast.success("Template downloaded!");
  };

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        id: crypto.randomUUID(),
        key: "",
        type: "string",
        value: "{{name}}",
        isCustom: false,
      },
    ]);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(
      formFields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  };

  const parseUrl = (value: string) => {
    if (!value.trim()) {
      setBaseUrl("");
      setPath("");
      return;
    }
    try {
      const parsed = new URL(value);
      if (parsed.pathname !== "/" || parsed.search) {
        setBaseUrl(`${parsed.protocol}//${parsed.host}`);
        setPath(parsed.pathname + parsed.search);
      } else {
        setBaseUrl(value);
      }
    } catch {
      setBaseUrl(value);
    }
  };

  if (!isLoaded) {
    return (
      <div className="border border-dashed border-border p-12 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Install Banner */}
      {showBanner && (
        <div className="flex items-center justify-between gap-4 p-4 border border-dashed border-[#BFA573]/50 bg-[#BFA573]/5">
          <div className="flex items-center gap-3 text-sm">
            <AlertTriangle className="size-4 text-[#BFA573] shrink-0" />
            <span>
              Make sure Tabby CLI is installed locally on your system.{" "}
              <Link
                href="/docs/installation"
                className="text-[#BFA573] hover:underline inline-flex items-center gap-1"
              >
                Install here <ExternalLink className="size-3" />
              </Link>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={dismissBanner}
            className="h-8 w-8 shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      <div className="border border-dashed border-border">
        {/* Top: URL Bar */}
        <div className="border-b border-dashed border-border p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 flex-1">
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as HttpMethod)}
              >
                <SelectTrigger
                  className={`h-10 w-28 border-0 focus:ring-0 ${
                    method === "POST"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <span className="font-medium">{method}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={fullUrl}
                onChange={(e) => parseUrl(e.target.value)}
                className="flex-1 font-mono text-sm h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <Button
              onClick={downloadTemplate}
              size="sm"
              className="gap-2 bg-[#BFA573] hover:bg-[#BFA573]/90 text-black font-medium h-10"
            >
              <Download className="size-4" />
              Download Template
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Configuration */}
          <div className="border-b border-dashed border-border lg:border-b-0 lg:border-r">
            {/* Config Section */}
            <div className="border-b border-dashed border-border p-6">
              <h3 className="font-medium text-base tracking-tight mb-4">
                Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block tracking-tight">
                    Base URL
                  </label>
                  <Input
                    value={baseUrl}
                    onChange={(e) => parseUrl(e.target.value)}
                    className="h-9 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                    placeholder="https://api.example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block tracking-tight">
                    Path
                  </label>
                  <Input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="h-9 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                    placeholder="/endpoint"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block tracking-tight">
                    Content-Type
                  </label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="h-9 font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((ct) => (
                        <SelectItem
                          key={ct}
                          value={ct}
                          className="font-mono text-xs"
                        >
                          {ct}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {method === "POST" && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block tracking-tight">
                      Loop Mode
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={loopEnabled ? "on" : "off"}
                        onValueChange={(v) => setLoopEnabled(v === "on")}
                      >
                        <SelectTrigger className="h-9 w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="off">Off</SelectItem>
                          <SelectItem value="on">On</SelectItem>
                        </SelectContent>
                      </Select>
                      {loopEnabled && (
                        <>
                          <Input
                            value={loopCount}
                            onChange={(e) => setLoopCount(e.target.value)}
                            className="h-9 w-16 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                            placeholder="10"
                          />
                          <Input
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className="h-9 w-16 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                            placeholder="1s"
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Body Section */}
            {method === "POST" && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-medium text-base tracking-tight">Body</h3>
                  <div className="flex gap-1">
                    <Badge
                      variant={bodyMode === "form" ? "default" : "outline"}
                      className="text-[10px] cursor-pointer"
                      onClick={() => setBodyMode("form")}
                    >
                      Form
                    </Badge>
                    <Badge
                      variant={bodyMode === "raw" ? "default" : "outline"}
                      className="text-[10px] cursor-pointer"
                      onClick={() => setBodyMode("raw")}
                    >
                      Raw
                    </Badge>
                  </div>
                </div>

                {bodyMode === "form" ? (
                  <div className="space-y-3">
                    {formFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          value={field.key}
                          onChange={(e) =>
                            updateField(field.id, { key: e.target.value })
                          }
                          placeholder="key"
                          className="h-9 font-mono text-sm flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                        />
                        <Select
                          value={field.type}
                          onValueChange={(v) =>
                            updateField(field.id, { type: v })
                          }
                        >
                          <SelectTrigger className="h-9 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map((t) => (
                              <SelectItem key={t} value={t} className="text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.isCustom ? (
                          <div className="flex gap-1 flex-1">
                            <Input
                              value={field.value}
                              onChange={(e) =>
                                updateField(field.id, { value: e.target.value })
                              }
                              placeholder="value"
                              className="h-9 font-mono text-sm flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0 text-[#BFA573]"
                              onClick={() =>
                                updateField(field.id, {
                                  isCustom: false,
                                  value: "{{name}}",
                                })
                              }
                            >
                              ✦
                            </Button>
                          </div>
                        ) : (
                          <Select
                            value={field.value}
                            onValueChange={(v) => {
                              if (v === "__custom__")
                                updateField(field.id, {
                                  isCustom: true,
                                  value: "",
                                });
                              else updateField(field.id, { value: v });
                            }}
                          >
                            <SelectTrigger className="h-9 font-mono text-sm text-[#BFA573] flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PLACEHOLDERS.map((p) => (
                                <SelectItem
                                  key={p.name}
                                  value={p.name}
                                  className="font-mono text-sm"
                                >
                                  {p.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="__custom__">
                                Custom...
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addField}
                      className="gap-2 mt-2"
                    >
                      <Plus className="size-4" /> Add Field
                    </Button>
                  </div>
                ) : (
                  <Textarea
                    value={rawBody}
                    onChange={(e) => setRawBody(e.target.value)}
                    placeholder='{"key": "{{placeholder}}"}'
                    className="min-h-[180px] font-mono text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
                  />
                )}
              </div>
            )}
          </div>

          {/* Right: Output */}
          <div className="flex flex-col">
            {/* Command Output */}
            <div className="border-b border-dashed border-border flex-1">
              <div className="flex items-center justify-between p-4 border-b border-dashed border-border">
                <Tabs value={outputTab} onValueChange={setOutputTab}>
                  <TabsList className="h-8 bg-muted/50">
                    <TabsTrigger value="tabby" className="text-xs h-7 px-3">
                      Tabby
                    </TabsTrigger>
                    <TabsTrigger value="curl" className="text-xs h-7 px-3">
                      cURL
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCommand}
                  className="h-8 gap-2 text-xs"
                >
                  {copied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="p-4 bg-muted/50 dark:bg-zinc-900 min-h-[180px]">
                {outputTab === "curl" && loopEnabled && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
                    <AlertTriangle className="size-4" />
                    <span>
                      Loop mode is not supported in cURL. Use Tabby CLI for loop
                      functionality.
                    </span>
                  </div>
                )}
                <pre className="text-sm font-mono leading-relaxed text-[#BFA573] whitespace-pre-wrap break-all">
                  {outputTab === "tabby"
                    ? buildTabbyCommand()
                    : buildCurlCommand()}
                </pre>
              </div>
            </div>

            {/* Preview */}
            <div className="border-b border-dashed border-border">
              <div className="p-4 border-b border-dashed border-border">
                <span className="font-medium text-base tracking-tight">
                  Generated Preview
                </span>
              </div>
              <div className="p-4 bg-muted/30 max-h-[200px] overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {generatedPreview}
                </pre>
              </div>
            </div>

            {/* Placeholders */}
            <div className="p-4">
              <div className="font-medium text-base tracking-tight mb-3">
                Available Placeholders
              </div>
              <TooltipProvider delayDuration={100}>
                <div className="flex flex-wrap gap-1.5">
                  {PLACEHOLDERS.map((p) => (
                    <Tooltip key={p.name}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs cursor-help border-dashed hover:bg-[#BFA573]/10 hover:text-[#BFA573] hover:border-[#BFA573]/30 transition-colors"
                        >
                          {p.name.replace(/\{\{|\}\}/g, "")}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-[#BFA573] text-black px-2 py-1"
                      >
                        <p className="text-[10px] font-medium">
                          {p.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

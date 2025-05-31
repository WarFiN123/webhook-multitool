"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Copy,
  Save,
  Send,
  Trash2,
  MoonStar,
  Sun,
  CircleStop,
  Play
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ColorPicker } from "@/components/color-picker";
import { WebhookHistory } from "@/components/webhook-history";
import { EmbedPreview } from "@/components/embed-preview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WebhookTool() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [savedWebhooks, setSavedWebhooks] = useState<
    { name: string; url: string }[]
  >([]);
  const [webhookName, setWebhookName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const [embedDescription, setEmbedDescription] = useState("");
  const [embedColor, setEmbedColor] = useState("#5865F2");
  const [embedAuthor, setEmbedAuthor] = useState("");
  const [embedAuthorIcon, setEmbedAuthorIcon] = useState("");
  const [embedFooter, setEmbedFooter] = useState("");
  const [embedFooterIcon, setEmbedFooterIcon] = useState("");
  const [embedThumbnail, setEmbedThumbnail] = useState("");
  const [embedImage, setEmbedImage] = useState("");
  const [useEmbed, setUseEmbed] = useState(false);
  const [useTTS, setUseTTS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("message");
  const [isSpamming, setIsSpamming] = useState(false);
  const [useSpam, setUseSpam] = useState(false);
  const spamRef = useRef<{ stop: boolean }>({ stop: false });

  useEffect(() => {
    const saved = localStorage.getItem("savedWebhooks");
    if (saved) {
      setSavedWebhooks(JSON.parse(saved));
    }

    const historyData = localStorage.getItem("webhookHistory");
    if (historyData) {
      setHistory(JSON.parse(historyData));
    }
  }, []);

  const { setTheme } = useTheme();
  const saveWebhook = () => {
    if (!webhookUrl || !webhookName) {
      toast.error("Error", {
        description: "Please provide both a name and URL for the webhook",
      });
      return;
    }

    const newWebhooks = [
      ...savedWebhooks,
      { name: webhookName, url: webhookUrl },
    ];
    setSavedWebhooks(newWebhooks);
    localStorage.setItem("savedWebhooks", JSON.stringify(newWebhooks));

    toast.success("Webhook saved", {
      description: `Webhook "${webhookName}" has been saved`,
    });

    setWebhookName("");
  };

  const deleteWebhook = (index: number) => {
    const newWebhooks = [...savedWebhooks];
    newWebhooks.splice(index, 1);
    setSavedWebhooks(newWebhooks);
    localStorage.setItem("savedWebhooks", JSON.stringify(newWebhooks));

    toast.success("Webhook deleted", {
      description: "The webhook has been removed from your saved list",
    });
  };

  const selectWebhook = (url: string) => {
    setWebhookUrl(url);
  };

  const sendWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Error", {
        description: "Please enter a webhook URL",
      });
      return;
    }

    setLoading(true);

    try {
      const payload: any = {};

      if (username) payload.username = username;
      if (avatarUrl) payload.avatar_url = avatarUrl;
      if (content) payload.content = content;

      if (useEmbed) {
        const embed: any = {};
        if (embedTitle) embed.title = embedTitle;
        if (embedDescription) embed.description = embedDescription;
        if (embedColor)
          embed.color = Number.parseInt(embedColor.replace("#", ""), 16);

        if (embedAuthor) {
          embed.author = { name: embedAuthor };
          if (embedAuthorIcon) embed.author.icon_url = embedAuthorIcon;
        }

        if (embedFooter) {
          embed.footer = { text: embedFooter };
          if (embedFooterIcon) embed.footer.icon_url = embedFooterIcon;
        }

        if (embedThumbnail) embed.thumbnail = { url: embedThumbnail };
        if (embedImage) embed.image = { url: embedImage };

        payload.embeds = [embed];
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(useTTS ? { ...payload, tts: true } : payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const historyItem = {
        timestamp: new Date().toISOString(),
        payload,
        webhookUrl,
      };

      const newHistory = [historyItem, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem("webhookHistory", JSON.stringify(newHistory));

      toast.success("Webhook sent", {
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error("Error sending webhook:", error);
      toast.error("Error sending webhook", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const startSpam = async () => {
    if (!webhookUrl) {
      toast.error("Error", {
        description: "Please enter a webhook URL",
      });
      return;
    }
    setIsSpamming(true);
    spamRef.current.stop = false;
    const payload: any = {};
    if (username) payload.username = username;
    if (avatarUrl) payload.avatar_url = avatarUrl;
    if (content) payload.content = content;
    if (useEmbed) {
      const embed: any = {};
      if (embedTitle) embed.title = embedTitle;
      if (embedDescription) embed.description = embedDescription;
      if (embedColor)
        embed.color = Number.parseInt(embedColor.replace("#", ""), 16);
      if (embedAuthor) {
        embed.author = { name: embedAuthor };
        if (embedAuthorIcon) embed.author.icon_url = embedAuthorIcon;
      }
      if (embedFooter) {
        embed.footer = { text: embedFooter };
        if (embedFooterIcon) embed.footer.icon_url = embedFooterIcon;
      }
      if (embedThumbnail) embed.thumbnail = { url: embedThumbnail };
      if (embedImage) embed.image = { url: embedImage };
      payload.embeds = [embed];
    }
    const spam = async () => {
      while (!spamRef.current.stop) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(useTTS ? { ...payload, tts: true } : payload),
          });
        } catch (error) {
          toast.error("Error sending spam message");
        }
      }
    };
    spam();
  };

  const stopSpam = () => {
    spamRef.current.stop = true;
    setIsSpamming(false);
    toast.info("Spam stopped", {
      description: "Stopped spamming the webhook.",
    });
  };

  const clearForm = () => {
    setContent("");
    setEmbedTitle("");
    setEmbedDescription("");
    setEmbedColor("#5865F2");
    setEmbedAuthor("");
    setEmbedAuthorIcon("");
    setEmbedFooter("");
    setEmbedFooterIcon("");
    setEmbedThumbnail("");
    setEmbedImage("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Discord Webhook Multi-Tool
      </h1>

      <Tabs
        defaultValue="message"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="message">Message</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="message" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Enter your webhook URL and customize the sender
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          {...(webhookUrl ? {} : { disabled: true })}
                          onClick={async () => {
                            if (!webhookUrl) return;
                            try {
                              const response = await fetch(webhookUrl, {
                                method: "DELETE",
                              });
                              if (response.ok) {
                                setWebhookUrl("");
                                toast.success("Webhook deleted", {
                                  description:
                                    "The webhook has been deleted from Discord.",
                                });
                              } else {
                                toast.error("Failed to delete webhook", {
                                  description: `Error: ${response.status} ${response.statusText}`,
                                });
                              }
                            } catch (error) {
                              toast.error("Error deleting webhook", {
                                description:
                                  error instanceof Error
                                    ? error.message
                                    : "Unknown error occurred",
                              });
                            }
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Webhook</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {savedWebhooks.length > 0 && (
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Saved
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0">
                          <div className="max-h-[300px] overflow-auto">
                            {savedWebhooks.map((webhook, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                                onClick={() => selectWebhook(webhook.url)}
                              >
                                <span className="truncate">{webhook.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteWebhook(index);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Override Username (optional)</Label>
                  <Input
                    id="username"
                    placeholder="Custom Bot Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL (optional)</Label>
                  <Input
                    id="avatar-url"
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Message Content</CardTitle>
                  <CardDescription>
                    Compose your webhook message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Text Message</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter your message here..."
                      className="min-h-[100px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-embed"
                      checked={useEmbed}
                      onCheckedChange={setUseEmbed}
                    />
                    <Label htmlFor="use-embed">Include Embed</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-tts"
                      checked={useTTS}
                      onCheckedChange={setUseTTS}
                    />
                    <Label htmlFor="use-tts">TTS</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="spam"
                      checked={useSpam}
                      onCheckedChange={setUseSpam}
                    />
                    <Label htmlFor="spam">Spam</Label>
                  </div>

                  {useEmbed && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="embed-title">Embed Title</Label>
                        <Input
                          id="embed-title"
                          placeholder="Embed Title"
                          value={embedTitle}
                          onChange={(e) => setEmbedTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="embed-description">
                          Embed Description
                        </Label>
                        <Textarea
                          id="embed-description"
                          placeholder="Embed description..."
                          className="min-h-[100px]"
                          value={embedDescription}
                          onChange={(e) => setEmbedDescription(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="embed-color">Embed Color</Label>
                        <ColorPicker
                          color={embedColor}
                          onChange={setEmbedColor}
                        />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="embed-author">Author Name</Label>
                          <Input
                            id="embed-author"
                            placeholder="Author name"
                            value={embedAuthor}
                            onChange={(e) => setEmbedAuthor(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-author-icon">
                            Author Icon URL
                          </Label>
                          <Input
                            id="embed-author-icon"
                            placeholder="https://example.com/icon.png"
                            value={embedAuthorIcon}
                            onChange={(e) => setEmbedAuthorIcon(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="embed-footer">Footer Text</Label>
                          <Input
                            id="embed-footer"
                            placeholder="Footer text"
                            value={embedFooter}
                            onChange={(e) => setEmbedFooter(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-footer-icon">
                            Footer Icon URL
                          </Label>
                          <Input
                            id="embed-footer-icon"
                            placeholder="https://example.com/icon.png"
                            value={embedFooterIcon}
                            onChange={(e) => setEmbedFooterIcon(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="embed-thumbnail">Thumbnail URL</Label>
                          <Input
                            id="embed-thumbnail"
                            placeholder="https://example.com/thumbnail.png"
                            value={embedThumbnail}
                            onChange={(e) => setEmbedThumbnail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-image">Image URL</Label>
                          <Input
                            id="embed-image"
                            placeholder="https://example.com/image.png"
                            value={embedImage}
                            onChange={(e) => setEmbedImage(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={clearForm}>
                    Clear
                  </Button>
                  {useSpam ? (
                    isSpamming ? (
                      <Button variant="destructive" onClick={stopSpam}>
                        <CircleStop className="h-4 w-4" />
                        Stop Spam
                      </Button>
                    ) : (
                      <Button onClick={startSpam} disabled={loading}>
                        <Play className="h-4 w-4" />
                        Start Spam
                      </Button>
                    )
                  ) : (
                    <Button onClick={sendWebhook} disabled={loading}>
                      <Send className="h-4 w-4" />
                      {loading ? "Sending..." : "Send Webhook"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    How your message will appear in Discord
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-[#36393f] text-white rounded-md p-4 min-h-[300px]">
                    {username && (
                      <div className="flex items-center gap-2 mb-2">
                        {avatarUrl ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                        )}
                        <span className="font-semibold">{username}</span>
                      </div>
                    )}

                    {content && <p className="mb-2 break-words">{content}</p>}

                    {useEmbed && (
                      <EmbedPreview
                        title={embedTitle}
                        description={embedDescription}
                        color={embedColor}
                        author={embedAuthor}
                        authorIcon={embedAuthorIcon}
                        footer={embedFooter}
                        footerIcon={embedFooterIcon}
                        thumbnail={embedThumbnail}
                        image={embedImage}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Webhooks</CardTitle>
              <CardDescription>
                Manage your saved Discord webhooks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-name">Webhook Name</Label>
                  <Input
                    id="webhook-name"
                    placeholder="My Server Webhook"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url-save">Webhook URL</Label>
                  <Input
                    id="webhook-url-save"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={saveWebhook} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Webhook
              </Button>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Your Saved Webhooks</h3>
                {savedWebhooks.length === 0 ? (
                  <p className="text-muted-foreground">
                    No webhooks saved yet. Add one above.
                  </p>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {savedWebhooks.map((webhook, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{webhook.name}</h4>
                                <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                                  {webhook.url}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    navigator.clipboard.writeText(webhook.url);
                                    toast.info("Copied", {
                                      description:
                                        "Webhook URL copied to clipboard",
                                    });
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setWebhookUrl(webhook.url);
                                    setActiveTab("message");
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => deleteWebhook(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <WebhookHistory history={history} />
        </TabsContent>
      </Tabs>
      <div className="mt-8 text-right flex justify-end gap-2">
        <Link
          target="_blank"
          href="https://discord.com/servers/uncover-it-1298592315694387220"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Image
            src="/discord.svg"
            alt="Discord"
            width="19"
            height="19"
            className="dark:brightness-100 brightness-0"
          />
        </Link>
        <Link
          target="_blank"
          href="https://github.com/WarFiN123/webhook-multitool"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Image
            src="/github.svg"
            alt="GitHub"
            width="19"
            height="19"
            className="dark:brightness-100 brightness-0"
          />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

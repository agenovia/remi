class Metadata {
  userId: string;
  timestamp: number;
  timezone: string;
  tags: string[] | undefined;

  constructor(userId: string, timezone: string, tags?: string[]) {
    this.userId = userId;
    this.timestamp = Date.now();
    this.timezone = timezone;
    this.tags = tags;
  }

  toJSON() {
    return {
      userId: this.userId,
      timestamp: this.timestamp,
      tags: this.tags ?? [],
    };
  }
}

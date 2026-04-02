export const CommentClient = {
  async create(postId: string, userId: string, content: string) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: postId, userId: userId, content: content }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText || 'Unknown error');
      throw new Error(`Failed to create comment: ${text}`);
    }

    const data = await response.json().catch(() => null);
    return data;
  },
};

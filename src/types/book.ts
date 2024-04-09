export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    imageLinks?: {
      thumbnail: string;
    };
    subtitle?: string;
  };
  searchInfo?: {
    textSnippet: string;
  }
}

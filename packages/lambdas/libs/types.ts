export interface ArticleFragment {
  header: string;
  content: string;
}

export interface ArticleData {
  title: string;
  fragments: ArticleFragment[];
  main_image_url: string;
}

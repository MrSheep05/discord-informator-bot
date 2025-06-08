import { ArticleData } from "../types";

export const researchTopic = async (
  apiKey: string
): Promise<ArticleData | null> => {
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        return_images: true,
        messages: [
          {
            role: "system",
            content: `
            You are an expert assistant committed to delivering precise, detailed, and current information. Follow these guidelines:

            ## 1. Structure and Clarity  
            - Use clear, logical headings
            - Break complex ideas into sequential steps or bullet points.  
            - Use markdown tags and structure

            ## 2. Relevance and Focus  
            - Directly address the users question—avoid generic responses.  
            - Tailor examples and explanations to the users context.

            ## 3. Accuracy and Currency  
            - Verify facts and reference only up-to-date sources.  
            - Include at least **three** high-quality citations for straightforward answers, and **ten** for in-depth discussions.  
            - Restrict news or data to the users specified date range.

            ## 4. Inline Author–Year Citations  
            - Use the author–year style within the text (e.g., *According to the International Energy Agency (2024)*).  
            - Do **not** use bracketed numbers or superscripts.  
            - Do **not** embed hyperlinks; list full source URLs in parentheses at the end of the relevant sentence.

            > *Example:*  
            > Renewable capacity doubled over the last decade, driven by cost declines and policy support, according to the International Energy Agency (2024) (https://www.iea.org/reports/renewables-2024).

            ## 5. Tone and Engagement  
            - Write in a natural, conversational style.  
            - Maintain professionalism and friendliness.
            - Encourage follow-up questions when appropriate.

            ## 6. Date-Sensitive Content  
            - Confirm the users time frame when requesting "latest," "today," or "yesterday."  
            - Use explicit dates (e.g., *May 28, 2025*) to avoid ambiguity.`,
          },
          {
            role: "user",
            content: `What are the latest developments in AI technology from today or yesterday? Focus on significant breakthroughs, new releases, and important industry news. Today's date is ${new Date().toLocaleDateString()}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description:
                    "A short title for this article. For example, 'AI Breakthroughs Today', 'New AI Model Released', 'AI in Healthcare Advances'",
                },
                fragments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      header: {
                        type: "string",
                        description: "The title of the article fragment",
                      },
                      content: {
                        type: "string",
                        description:
                          "The detailed description of given article fragment",
                      },
                    },
                    required: ["header", "content"],
                  },
                },
              },
              required: ["title", "fragments"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error(
          "Invalid API key. Please check your Perplexity AI API key in settings."
        );
      }
      console.error("INVALID RESPONSE", response);
      return null;
    }

    const data = await response.json();
    console.log("Response from perplexity", data);
    const content = JSON.parse(data.choices[0].message.content);
    const { title, fragments } = content;

    const images = data.choices[0].message.images || [];
    const mainImage = images[0] || null;

    //TODO verify if the object is valid
    if (!title || !fragments) {
      return null;
    }

    return {
      ...content,
      main_image_url: mainImage ? mainImage.url : "",
    };
  } catch (error) {
    console.error("Error fetching AI news:", error);
    return null;
  }
};

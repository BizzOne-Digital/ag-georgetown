export interface FaqItem {
  question: string;
  answer: string;
}

// Home's "FAQ Preview" shows the first 4; Contact's "Common Questions"
// shows all 6.
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Are your products authentic?",
    answer: "Yes. Every item is sourced directly from official distributors and verified before it hits our shelves.",
  },
  {
    question: "Do you offer online ordering?",
    answer: "Not yet - we're an in-store experience for now, but our online offers page always reflects what's currently available.",
  },
  {
    question: "Can I return or exchange items?",
    answer: "Ask our team in-store about our return policy for unopened products.",
  },
  {
    question: "Do you carry both men's and women's fragrances?",
    answer: "Yes, a full range for him and her, from everyday scents to special-occasion picks.",
  },
  {
    question: "What forms of payment do you accept?",
    answer: "We accept all major credit/debit cards and cash in-store.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, parking is available near our Guelph St location.",
  },
];

/**
 * Type for full story content. Structure follows docs/SCAM_STORIES_STRUCTURE_for_Writer.md.
 */
export interface StoryContent {
  characterIntro: string;
  initialPlot: string;
  scamExperience: string;
  victimExperience: string;
  victimPain: string;
  climax: string;
  learningVictim: string;
  /** Actionable takeaways: bullets or short paragraphs. */
  learningForReaders: string[];
}

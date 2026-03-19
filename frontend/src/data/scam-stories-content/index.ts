/**
 * Full story content for scam experience pages.
 * One file per story under scam-stories-content/; structure follows docs/SCAM_STORIES_STRUCTURE_for_Writer.md.
 */

import type { StoryContent } from './types';

import pump_and_dump_fake_guru_investment_group from './pump-and-dump-fake-guru-investment-group';
import lpg_payment_pending_link_phone_hijacked from './lpg-payment-pending-link-phone-hijacked';
import catfished_fake_profile_drained_savings from './catfished-fake-profile-drained-savings';
import how_i_lost_12000_someone_i_never_met from './how-i-lost-12000-someone-i-never-met';
import romance_scam_lasted_two_years from './romance-scam-lasted-two-years';
import i_thought_we_were_getting_married from './i-thought-we-were-getting-married';
import when_love_asked_for_gift_cards from './when-love-asked-for-gift-cards';
import whatsapp_romance_cost_me_everything from './whatsapp-romance-cost-me-everything';
import why_i_sent_money_to_stranger_i_loved_online from './why-i-sent-money-to-stranger-i-loved-online';
import military_romance_scam_deployed from './military-romance-scam-deployed';
import i_fell_for_crypto_romance_scam from './i-fell-for-crypto-romance-scam';
import moment_i_realised_online_partner_was_scammer from './moment-i-realised-online-partner-was-scammer';
import too_good_to_be_true_investment_life_savings from './too-good-to-be-true-investment-life-savings';
import pension_into_fake_crypto_platform from './pension-into-fake-crypto-platform';
import trading_app_vanished_with_my_money from './trading-app-vanished-with-my-money';
import double_your_bitcoin_scam from './double-your-bitcoin-scam';
import friend_recommended_fake_investment from './friend-recommended-fake-investment';
import recovery_room_scam_came_back_for_more from './recovery-room-scam-came-back-for-more';
import linkedin_opportunity_cost_50000 from './linkedin-opportunity-cost-50000';
import lost_money_cloned_broker_website from './lost-money-cloned-broker-website';
import pig_butchering_slowly_drained_months from './pig-butchering-slowly-drained-months';
import fake_celebrity_crypto_endorsements from './fake-celebrity-crypto-endorsements';
import whatsapp_investment_group_wasnt from './whatsapp-investment-group-wasnt';
import thought_day_trading_was_being_scammed from './thought-day-trading-was-being-scammed';
import forex_scam_account_never_withdraw from './forex-scam-account-never-withdraw';
import recovery_lawyer_tried_to_scam_again from './recovery-lawyer-tried-to-scam-again';
import email_looked_like_from_my_bank from './email-looked-like-from-my-bank';
import i_clicked_the_link_phishing_story from './i-clicked-the-link-phishing-story';

const STORY_CONTENT: Record<string, StoryContent> = {
  'pump-and-dump-fake-guru-investment-group': pump_and_dump_fake_guru_investment_group,
  'lpg-payment-pending-link-phone-hijacked': lpg_payment_pending_link_phone_hijacked,
  'catfished-fake-profile-drained-savings': catfished_fake_profile_drained_savings,
  'how-i-lost-12000-someone-i-never-met': how_i_lost_12000_someone_i_never_met,
  'romance-scam-lasted-two-years': romance_scam_lasted_two_years,
  'i-thought-we-were-getting-married': i_thought_we_were_getting_married,
  'when-love-asked-for-gift-cards': when_love_asked_for_gift_cards,
  'whatsapp-romance-cost-me-everything': whatsapp_romance_cost_me_everything,
  'why-i-sent-money-to-stranger-i-loved-online': why_i_sent_money_to_stranger_i_loved_online,
  'military-romance-scam-deployed': military_romance_scam_deployed,
  'i-fell-for-crypto-romance-scam': i_fell_for_crypto_romance_scam,
  'moment-i-realised-online-partner-was-scammer': moment_i_realised_online_partner_was_scammer,
  'too-good-to-be-true-investment-life-savings': too_good_to_be_true_investment_life_savings,
  'pension-into-fake-crypto-platform': pension_into_fake_crypto_platform,
  'trading-app-vanished-with-my-money': trading_app_vanished_with_my_money,
  'double-your-bitcoin-scam': double_your_bitcoin_scam,
  'friend-recommended-fake-investment': friend_recommended_fake_investment,
  'recovery-room-scam-came-back-for-more': recovery_room_scam_came_back_for_more,
  'linkedin-opportunity-cost-50000': linkedin_opportunity_cost_50000,
  'lost-money-cloned-broker-website': lost_money_cloned_broker_website,
  'pig-butchering-slowly-drained-months': pig_butchering_slowly_drained_months,
  'fake-celebrity-crypto-endorsements': fake_celebrity_crypto_endorsements,
  'whatsapp-investment-group-wasnt': whatsapp_investment_group_wasnt,
  'thought-day-trading-was-being-scammed': thought_day_trading_was_being_scammed,
  'forex-scam-account-never-withdraw': forex_scam_account_never_withdraw,
  'recovery-lawyer-tried-to-scam-again': recovery_lawyer_tried_to_scam_again,
  'email-looked-like-from-my-bank': email_looked_like_from_my_bank,
  'i-clicked-the-link-phishing-story': i_clicked_the_link_phishing_story,
};

export type { StoryContent } from './types';
export { STORY_CONTENT };

/**
 * Returns full story content for a slug, or null if only the listing/title exists.
 */
export function getStoryContent(slug: string): StoryContent | null {
  return STORY_CONTENT[slug] ?? null;
}

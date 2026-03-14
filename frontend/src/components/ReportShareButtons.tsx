'use client';

import { useState, useEffect } from 'react';

const DEFAULT_SHARE_TEXT = 'Scam report – Scam Avenger';
/** Max length for share content (formatted report); WhatsApp supports long messages; X/Threads may truncate. */
const MAX_CONTENT_PREVIEW = 3000;

/**
 * Builds the WhatsApp share URL. Opens WhatsApp with the message pre-filled;
 * user chooses a chat to send to. Works for both "share link" and "share content".
 * @param reportUrl - Full URL of the report page
 * @param messageText - Either short label (link only) or report content snippet
 */
function getWhatsAppShareUrl(reportUrl: string, messageText: string): string {
  const body = `${messageText} ${reportUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}

/** Build WhatsApp share URL from the full message body (e.g. after user edits in modal). */
function getWhatsAppShareUrlFromBody(body: string): string {
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}

/** Facebook shares Scamenger.com only (no report link); avoids links in content per platform policy. */
const SCAMENGER_URL = 'https://scamenger.com';

function getFacebookShareUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SCAMENGER_URL)}`;
}

/**
 * Builds share URLs for Facebook, X, Threads, and WhatsApp.
 * Facebook always uses Scamenger.com (no report link); other platforms use report URL and text.
 */
function getShareUrls(url: string, text: string, appendUrlToText: boolean = false) {
  const encodedUrl = encodeURIComponent(url);
  const body = appendUrlToText ? `${text} ${url}` : text;
  const encodedText = encodeURIComponent(appendUrlToText ? body : text);
  return {
    facebook: getFacebookShareUrl(),
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    threads: `https://www.threads.net/intent/post?text=${encodedText}&url=${encodedUrl}`,
    whatsapp: getWhatsAppShareUrl(url, text),
  };
}

const FACEBOOK_PATH = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
const X_PATH = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';
const THREADS_PATH = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c1.94 0 3.71.78 5 2.05V6c0 .55-.45 1-1 1s-1-.45-1-1v-.61A7.95 7.95 0 0012 4zm-4.9 2.34A7.98 7.98 0 004 12c0 1.54.43 2.98 1.18 4.21L4.2 14.8A9.96 9.96 0 012 12a9.96 9.96 0 012.2-6.2L7.1 6.34zM12 20c-1.94 0-3.71-.78-5-2.05V18c0 .55.45 1 1 1s1-.45 1-1v.61A7.95 7.95 0 0012 20zm4.9-2.34A7.98 7.98 0 0020 12c0-1.54-.43-2.98-1.18-4.21l1.02-1.01A9.96 9.96 0 0122 12a9.96 9.96 0 01-2.2 6.2l-4.9-4.86zM9 10h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1z';
const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

export interface ReportShareButtonsProps {
  /** Full URL of the report page to share. */
  url: string;
  /** Short text for "Share link" (default: "Scam report – Scam Avenger"). */
  shareText?: string;
  /** Optional content for "Share content" (e.g. report summary + narrative). When set, both rows are shown. */
  contentText?: string;
  /** Optional link-free content for Facebook (no URLs; includes note to visit Scamenger). Not sent to Facebook (sharer has no text param); used for consistency. */
  contentTextFacebook?: string;
}

/**
 * Row of share buttons (Facebook, X, Threads, WhatsApp) that open
 * each platform’s share intent in a new tab with the report URL.
 */
const FACEBOOK_MODAL_DEFAULT_TEXT = 'Scam report – Scam Avenger.\n\nVisit Scamenger website to view full report and links.';

function ShareIconRow({
  links,
  iconSize,
  iconClass,
  onFacebookClick,
  onWhatsAppClick,
}: {
  links: { facebook: string; x: string; threads: string; whatsapp: string };
  iconSize: number;
  iconClass: string;
  onFacebookClick?: () => void;
  onWhatsAppClick?: () => void;
}) {
  return (
    <>
      {onFacebookClick ? (
        <button
          type="button"
          onClick={onFacebookClick}
          className="report-share-btn report-share-btn-facebook"
          aria-label="Share on Facebook (links to Scamenger; visit site for full report and links)"
          title="Share on Facebook (links to Scamenger; visit site for full report and links)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={FACEBOOK_PATH} /></svg>
        </button>
      ) : (
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="report-share-btn report-share-btn-facebook" aria-label="Share on Facebook" title="Share on Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={FACEBOOK_PATH} /></svg>
        </a>
      )}
      <a href={links.x} target="_blank" rel="noopener noreferrer" className="report-share-btn report-share-btn-x" aria-label="Share on X">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={X_PATH} /></svg>
      </a>
      <a href={links.threads} target="_blank" rel="noopener noreferrer" className="report-share-btn report-share-btn-threads" aria-label="Share on Threads">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={THREADS_PATH} /></svg>
      </a>
      {onWhatsAppClick ? (
        <button
          type="button"
          onClick={onWhatsAppClick}
          className="report-share-btn report-share-btn-whatsapp"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={WHATSAPP_PATH} /></svg>
        </button>
      ) : (
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="report-share-btn report-share-btn-whatsapp" aria-label="Share on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={iconSize} height={iconSize} className={iconClass} aria-hidden><path d={WHATSAPP_PATH} /></svg>
        </a>
      )}
    </>
  );
}

export function ReportShareButtons({ url, shareText, contentText, contentTextFacebook }: ReportShareButtonsProps) {
  const [facebookModalOpen, setFacebookModalOpen] = useState(false);
  const [facebookEditContent, setFacebookEditContent] = useState('');
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappEditContent, setWhatsappEditContent] = useState('');
  if (!url) return null;
  const linkText = shareText ?? DEFAULT_SHARE_TEXT;
  const contentPreview = contentText
    ? (contentText.length > MAX_CONTENT_PREVIEW ? `${contentText.slice(0, MAX_CONTENT_PREVIEW)}…` : contentText)
    : null;
  const messageText = contentPreview ?? linkText;
  const links = getShareUrls(url, messageText, true);
  const iconSize = 22;
  const iconClass = 'report-share-icon';

  const openFacebookModal = () => {
    setFacebookEditContent(contentTextFacebook ?? FACEBOOK_MODAL_DEFAULT_TEXT);
    setFacebookModalOpen(true);
  };

  const closeFacebookModal = () => setFacebookModalOpen(false);

  const handleFacebookSubmit = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(facebookEditContent).catch(() => {});
    }
    window.open(getFacebookShareUrl(), '_blank', 'noopener,noreferrer');
    closeFacebookModal();
  };

  const openWhatsappModal = () => {
    setWhatsappEditContent(`${messageText}\n\n${url}`);
    setWhatsappModalOpen(true);
  };

  const closeWhatsappModal = () => setWhatsappModalOpen(false);

  const handleWhatsappSubmit = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(whatsappEditContent).catch(() => {});
    }
    window.open(getWhatsAppShareUrlFromBody(whatsappEditContent), '_blank', 'noopener,noreferrer');
    closeWhatsappModal();
  };

  useEffect(() => {
    if (!facebookModalOpen && !whatsappModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (facebookModalOpen) closeFacebookModal();
        else closeWhatsappModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [facebookModalOpen, whatsappModalOpen]);

  return (
    <div className="report-share-options" role="group" aria-label="Share to social">
      <div className="report-share-buttons" aria-label="Share content">
        <ShareIconRow links={links} iconSize={iconSize} iconClass={iconClass} onFacebookClick={openFacebookModal} onWhatsAppClick={openWhatsappModal} />
      </div>

      {facebookModalOpen && (
        <div
          className="report-share-fb-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeFacebookModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-share-fb-modal-title"
        >
          <div className="report-share-fb-modal">
            <div className="report-share-fb-modal-header">
              <h2 id="report-share-fb-modal-title" className="report-share-fb-modal-title">
                Share to Facebook
              </h2>
              <button type="button" onClick={closeFacebookModal} className="report-share-fb-modal-close" aria-label="Close">
                ×
              </button>
            </div>
            <p className="report-share-fb-modal-intro">
              Edit the content below if you like. It will be copied to your clipboard when you submit. Facebook will open linking to Scamenger (no report link). You can paste the text into your post.
            </p>
            <div className="report-share-fb-form-group">
              <label htmlFor="report-share-fb-content" className="report-share-fb-label">
                Content to share
              </label>
              <textarea
                id="report-share-fb-content"
                className="report-share-fb-textarea"
                value={facebookEditContent}
                onChange={(e) => setFacebookEditContent(e.target.value)}
                rows={12}
              />
            </div>
            <div className="report-share-fb-actions">
              <button type="button" onClick={closeFacebookModal} className="report-share-fb-btn report-share-fb-btn-cancel">
                Cancel
              </button>
              <button type="button" onClick={handleFacebookSubmit} className="report-share-fb-btn report-share-fb-btn-submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {whatsappModalOpen && (
        <div
          className="report-share-fb-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeWhatsappModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-share-wa-modal-title"
        >
          <div className="report-share-fb-modal">
            <div className="report-share-fb-modal-header">
              <h2 id="report-share-wa-modal-title" className="report-share-fb-modal-title">
                Share to WhatsApp
              </h2>
              <button type="button" onClick={closeWhatsappModal} className="report-share-fb-modal-close" aria-label="Close">
                ×
              </button>
            </div>
            <p className="report-share-fb-modal-intro">
              Edit the message below if you like. It will be copied to your clipboard when you submit. WhatsApp will then open with this message pre-filled so you can choose a chat to send to.
            </p>
            <div className="report-share-fb-form-group">
              <label htmlFor="report-share-wa-content" className="report-share-fb-label">
                Message to share
              </label>
              <textarea
                id="report-share-wa-content"
                className="report-share-fb-textarea"
                value={whatsappEditContent}
                onChange={(e) => setWhatsappEditContent(e.target.value)}
                rows={12}
              />
            </div>
            <div className="report-share-fb-actions">
              <button type="button" onClick={closeWhatsappModal} className="report-share-fb-btn report-share-fb-btn-cancel">
                Cancel
              </button>
              <button type="button" onClick={handleWhatsappSubmit} className="report-share-fb-btn report-share-fb-btn-submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

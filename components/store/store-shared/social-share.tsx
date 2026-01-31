import React from "react";
import {
  FacebookIcon,
  PinterestIcon,
  WhatsappIcon,
  XIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  PinterestShareButton,
} from "react-share";

interface Props {
  url: string;
  quote: string;
}

const SocialShare: React.FC<Props> = ({ url, quote }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <FacebookShareButton url={url} hashtag="#Deekrub" title={quote}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={quote}>
        <XIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} separator=":: " title={quote}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <PinterestShareButton url={url} media={quote}>
        <PinterestIcon size={32} round />
      </PinterestShareButton>
    </div>
  );
};

export default SocialShare;

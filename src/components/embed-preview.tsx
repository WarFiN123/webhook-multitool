import Image from "next/image";

interface EmbedPreviewProps {
  title?: string;
  description?: string;
  color?: string;
  author?: string;
  authorIcon?: string;
  footer?: string;
  footerIcon?: string;
  thumbnail?: string;
  image?: string;
}

export function EmbedPreview({
  title,
  description,
  color = "#5865F2",
  author,
  authorIcon,
  footer,
  footerIcon,
  thumbnail,
  image,
}: EmbedPreviewProps) {
  return (
    <div
      className="rounded-md overflow-hidden max-w-[520px]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="bg-[#2f3136] p-3 rounded-tr-md rounded-br-md">
        {author && (
          <div className="flex items-center gap-2 mb-2">
            {authorIcon && (
              <Image src={authorIcon} alt="" className="rounded-full" height={6} width={6}/>
            )}
            <span className="text-sm font-medium">{author}</span>
          </div>
        )}

        <div className="flex">
          <div className="flex-1" style={{ wordBreak: "break-word" }}>
            {title && <div className="font-semibold mb-1">{title}</div>}
            {description && (
              <div
                className="text-sm text-gray-300 whitespace-pre-wrap"
              >
                {description}
              </div>
            )}

            {image && (
              <div className="mt-3">
                <Image
                  src={image}
                  alt=""
                  className="max-w-full rounded-md max-h-[300px] object-contain"
                />
              </div>
            )}

            {footer && (
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                {footerIcon && (
                  <Image
                    src={footerIcon}
                    alt=""
                    className="rounded-full"
                    width={5}
                    height={5}
                  />
                )}
                <span>{footer}</span>
              </div>
            )}
          </div>

          {thumbnail && (
            <div className="ml-4">
              <Image
                src={thumbnail}
                alt=""
                className="object-cover rounded-md"
                height={20}
                width={20}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

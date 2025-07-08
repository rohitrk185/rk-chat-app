interface AvatarProps {
  src: string | null;
  fallback: string;
  alt?: string;
}

const Avatar = ({ src, fallback, alt = "User avatar" }: AvatarProps) => {
  return (
    <div className="relative h-12 w-12 flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            // Handle image loading errors by hiding the img tag
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="h-full w-full rounded-full bg-sky-500 flex items-center justify-center font-bold text-xl text-white">
          {fallback.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;

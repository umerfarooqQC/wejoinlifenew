import React from 'react';
import './Avatar.css';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'WJL',
  size = 'md',
  status,
  className = '',
}) => {
  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`wjl-avatar wjl-avatar--${size} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="wjl-avatar__img" />
      ) : (
        <span className="wjl-avatar__initials">{getInitials(name)}</span>
      )}
      {status && <span className={`wjl-avatar__status wjl-avatar__status--${status}`} />}
    </div>
  );
};

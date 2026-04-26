import * as React from "react";
import { Icon, type IconProps } from "./Icon";

type I = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
const make = (d: React.ReactNode, name: string): I => {
  const C = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => <Icon ref={ref} {...props}>{d}</Icon>);
  C.displayName = name;
  return C;
};

// Navigation
export const ChevronLeftIcon = make(<polyline points="15 18 9 12 15 6" />, "ChevronLeftIcon");
export const ChevronRightIcon = make(<polyline points="9 18 15 12 9 6" />, "ChevronRightIcon");
export const ChevronDownIcon = make(<polyline points="6 9 12 15 18 9" />, "ChevronDownIcon");
export const ChevronUpIcon = make(<polyline points="18 15 12 9 6 15" />, "ChevronUpIcon");
export const ArrowRightIcon = make(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>, "ArrowRightIcon");
export const ArrowLeftIcon = make(<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>, "ArrowLeftIcon");
export const MenuIcon = make(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>, "MenuIcon");
export const CloseIcon = make(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, "CloseIcon");

// Status
export const CheckIcon = make(<polyline points="20 6 9 17 4 12" />, "CheckIcon");
export const CheckCircleIcon = make(<><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></>, "CheckCircleIcon");
export const AlertCircleIcon = make(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, "AlertCircleIcon");
export const InfoIcon = make(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>, "InfoIcon");
export const XCircleIcon = make(<><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>, "XCircleIcon");

// Social / actions
export const HeartIcon = make(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, "HeartIcon");
export const BookmarkIcon = make(<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />, "BookmarkIcon");
export const ShareIcon = make(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>, "ShareIcon");
export const SearchIcon = make(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, "SearchIcon");
export const FilterIcon = make(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />, "FilterIcon");

// User / auth
export const UserIcon = make(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, "UserIcon");
export const UsersIcon = make(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, "UsersIcon");
export const LogInIcon = make(<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>, "LogInIcon");
export const LogOutIcon = make(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>, "LogOutIcon");
export const LockIcon = make(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, "LockIcon");
export const EyeIcon = make(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, "EyeIcon");
export const EyeOffIcon = make(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>, "EyeOffIcon");

// Content
export const MailIcon = make(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, "MailIcon");
export const PhoneIcon = make(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />, "PhoneIcon");
export const MapPinIcon = make(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>, "MapPinIcon");
export const CalendarIcon = make(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, "CalendarIcon");
export const ClockIcon = make(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, "ClockIcon");
export const FileIcon = make(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, "FileIcon");
export const ImageIcon = make(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>, "ImageIcon");
export const UploadIcon = make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>, "UploadIcon");
export const DownloadIcon = make(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>, "DownloadIcon");

// Dashboard
export const HomeIcon = make(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>, "HomeIcon");
export const LayoutDashboardIcon = make(<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>, "LayoutDashboardIcon");
export const SettingsIcon = make(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>, "SettingsIcon");
export const BellIcon = make(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>, "BellIcon");
export const InboxIcon = make(<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>, "InboxIcon");
export const MessageCircleIcon = make(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />, "MessageCircleIcon");

// Money / commerce
export const CreditCardIcon = make(<><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>, "CreditCardIcon");
export const DollarSignIcon = make(<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>, "DollarSignIcon");
export const TrendingUpIcon = make(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, "TrendingUpIcon");
export const TrendingDownIcon = make(<><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>, "TrendingDownIcon");
export const TargetIcon = make(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>, "TargetIcon");
export const GiftIcon = make(<><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>, "GiftIcon");

// Misc
export const PlusIcon = make(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, "PlusIcon");
export const MinusIcon = make(<line x1="5" y1="12" x2="19" y2="12" />, "MinusIcon");
export const EditIcon = make(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>, "EditIcon");
export const TrashIcon = make(<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>, "TrashIcon");
export const MoreHorizontalIcon = make(<><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>, "MoreHorizontalIcon");
export const MoreVerticalIcon = make(<><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></>, "MoreVerticalIcon");
export const ExternalLinkIcon = make(<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>, "ExternalLinkIcon");
export const StarIcon = make(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, "StarIcon");
export const FlagIcon = make(<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>, "FlagIcon");
export const ShieldIcon = make(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, "ShieldIcon");
export const GlobeIcon = make(<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, "GlobeIcon");
export const TagIcon = make(<><path d="M20.59 13.41L13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>, "TagIcon");

// Text formatting
export const BoldIcon = make(<><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></>, "BoldIcon");
export const ItalicIcon = make(<><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></>, "ItalicIcon");
export const HeadingIcon = make(<><path d="M6 12h12" /><path d="M6 20V4" /><path d="M18 20V4" /></>, "HeadingIcon");
export const ListIcon = make(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>, "ListIcon");

// Links & attach
export const LinkIcon = make(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>, "LinkIcon");

// Alerts / status extras
export const AlertTriangleIcon = make(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>, "AlertTriangleIcon");
export const BadgeCheckIcon = make(<><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" /><polyline points="9 12 11 14 15 10" /></>, "BadgeCheckIcon");
export const PauseIcon = make(<><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>, "PauseIcon");
export const LoaderIcon = make(<><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></>, "LoaderIcon");

// Navigation / dashboard extras
export const MegaphoneIcon = make(<><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>, "MegaphoneIcon");
export const HandHeartIcon = make(<><path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" /><path d="M7 20l1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="M15.5 5.5a2.5 2.5 0 0 0-3.54 0L12 5.96l-.46-.46a2.5 2.5 0 1 0-3.54 3.54L12 13l3.99-3.96a2.5 2.5 0 0 0 .01-3.54z" /></>, "HandHeartIcon");
export const WalletIcon = make(<><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></>, "WalletIcon");
export const ScrollTextIcon = make(<><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></>, "ScrollTextIcon");
export const FileTextIcon = make(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>, "FileTextIcon");

// Content / media extras
export const SendIcon = make(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>, "SendIcon");
export const SparklesIcon = make(<><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z" /><path d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75z" /></>, "SparklesIcon");
export const ImagePlusIcon = make(<><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /><circle cx="8.5" cy="10.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>, "ImagePlusIcon");

// Brand socials
export const FacebookIcon = make(<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />, "FacebookIcon");
export const InstagramIcon = make(<><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></>, "InstagramIcon");
export const TwitterIcon = make(<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />, "TwitterIcon");
export const LinkedinIcon = make(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>, "LinkedinIcon");
export const XSocialIcon = make(<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />, "XSocialIcon");
export const YoutubeIcon = make(<path d="M23 7s-.2-1.4-.8-2c-.8-.9-1.7-.9-2.1-1C17.1 3.8 12 3.8 12 3.8s-5.1 0-8.1.3c-.4 0-1.3 0-2.1 1-.6.6-.8 2-.8 2S.8 8.6.8 10.3v1.5c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.8.9 1.9.9 2.4 1 1.7.2 7.8.3 7.8.3s5.1 0 8.1-.3c.4 0 1.3 0 2.1-1 .6-.6.8-2 .8-2s.2-1.7.2-3.3v-1.5C23.2 8.6 23 7 23 7zM9.7 13.7V7.9l6.6 2.9-6.6 2.9z" />, "YoutubeIcon");
export const TiktokIcon = make(<path d="M19.6 6.3a5.3 5.3 0 0 1-3.3-1.3 5.3 5.3 0 0 1-1.7-3H11v12.3a3 3 0 1 1-3-3v-3.5a6.5 6.5 0 1 0 6.5 6.5V9.9a8.7 8.7 0 0 0 5.1 1.7z" />, "TiktokIcon");
export const WhatsappIcon = make(<path d="M20.5 3.5A10 10 0 0 0 3.9 16l-1.4 5.1a.5.5 0 0 0 .6.6l5.2-1.4A10 10 0 1 0 20.5 3.5zM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-3.1.8.8-3-.2-.3a7.5 7.5 0 1 1 6.6 3.7zm4.1-5.5c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5.1s-1-.4-1.8-1.1a6.6 6.6 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.3-.4c.1-.1.2-.3.3-.4s0-.3 0-.4-.5-1.3-.7-1.8-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3a2.4 2.4 0 0 0-.8 1.8 4.2 4.2 0 0 0 .9 2.3 9.7 9.7 0 0 0 3.8 3.4c.5.2.9.4 1.2.5a3 3 0 0 0 1.4.1 2.3 2.3 0 0 0 1.5-1.1c.2-.4.2-.8.1-.9s-.2-.2-.4-.3z" />, "WhatsappIcon");
export const TelegramIcon = make(<path d="M21.8 3.2a1.6 1.6 0 0 0-1.7-.3L3 9.9a1.1 1.1 0 0 0 0 2l4.6 1.7 1.8 5.7a.8.8 0 0 0 1.3.3l2.7-2.4 4.5 3.3a1.3 1.3 0 0 0 2-.8l3.5-13.6a1.5 1.5 0 0 0-.6-1.5zM9.7 14.8l-.5 4-1.4-4.5 10.3-7z" />, "TelegramIcon");
export const DiscordIcon = make(<path d="M19.3 5.4a17 17 0 0 0-4.2-1.3l-.2.4a14 14 0 0 1 3.7 1.2 13.6 13.6 0 0 0-13.2 0 14 14 0 0 1 3.7-1.2l-.2-.4a17 17 0 0 0-4.2 1.3A17.6 17.6 0 0 0 1.8 18a17 17 0 0 0 5.2 2.6l.4-.6a11 11 0 0 1-1.8-.9l.4-.3a12.2 12.2 0 0 0 10.4 0l.4.3a11 11 0 0 1-1.8.9l.4.6a17 17 0 0 0 5.2-2.6 17.6 17.6 0 0 0-1.3-12.6zM8.6 15.4a2 2 0 0 1-1.8-2 2 2 0 0 1 1.8-2 2 2 0 0 1 1.8 2 2 2 0 0 1-1.8 2zm6.8 0a2 2 0 0 1-1.8-2 2 2 0 0 1 1.8-2 2 2 0 0 1 1.8 2 2 2 0 0 1-1.8 2z" />, "DiscordIcon");
export const PinterestIcon = make(<path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2.1 0-3l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.4 0 .9-.5 2.2-.8 3.4a1.5 1.5 0 0 0 1.5 1.8c1.8 0 3.2-1.9 3.2-4.7a4 4 0 0 0-4.3-4.2 4.4 4.4 0 0 0-4.6 4.4 3.9 3.9 0 0 0 .8 2.3c.1.2.1.2.1.4l-.3 1.1c0 .2-.1.3-.3.2-1.2-.6-2-2.3-2-3.7 0-3 2.2-5.8 6.3-5.8a5.6 5.6 0 0 1 5.9 5.5c0 3.3-2 6-5 6a2.6 2.6 0 0 1-2.3-1.2l-.6 2.4a11 11 0 0 1-1.3 2.7A10 10 0 1 0 12 2z" />, "PinterestIcon");
export const SnapchatIcon = make(<path d="M12 2.5a5 5 0 0 1 5 5v3l1.6.6a.7.7 0 0 1 .1 1.3 14 14 0 0 1-2.6 1 6 6 0 0 1-1 2 6 6 0 0 1 3.2 1.4.7.7 0 0 1-.1 1.2 12 12 0 0 1-3.4 1.1.7.7 0 0 0-.6.5 4 4 0 0 1-.6 1.2.7.7 0 0 1-.8.2 7 7 0 0 0-4.5 0 .7.7 0 0 1-.8-.2 4 4 0 0 1-.6-1.2.7.7 0 0 0-.6-.5 12 12 0 0 1-3.4-1.1.7.7 0 0 1-.1-1.2 6 6 0 0 1 3.2-1.4 6 6 0 0 1-1-2 14 14 0 0 1-2.6-1 .7.7 0 0 1 .1-1.3L7 10.5v-3a5 5 0 0 1 5-5z" />, "SnapchatIcon");
export const ThreadsIcon = make(<path d="M12 2a9.8 9.8 0 0 0-9.9 9.8A9.9 9.9 0 0 0 12 22a9.8 9.8 0 0 0 9.9-9.8A9.7 9.7 0 0 0 12 2zm0 17.3a7.3 7.3 0 0 1-5.2-2.2 7.6 7.6 0 0 1 0-10.5 7.3 7.3 0 0 1 10.4 0 7.6 7.6 0 0 1 0 10.5A7.3 7.3 0 0 1 12 19.3zm3.8-7.9a4.2 4.2 0 0 0-2.4-2 3.8 3.8 0 0 0-3.1 0 2.6 2.6 0 0 0-1.4 1.4.8.8 0 0 0 1.4.6 1.1 1.1 0 0 1 .6-.5 2.3 2.3 0 0 1 1.8 0 2.7 2.7 0 0 1 1.5 1.3 2.1 2.1 0 0 1-.2 2 2.6 2.6 0 0 1-1.6 1 3.3 3.3 0 0 1-2.8-.9 3.6 3.6 0 0 1-1-2.6 3.4 3.4 0 0 1 1-2.5 3.9 3.9 0 0 1 5.4 0 .8.8 0 0 0 1-1.1 5.4 5.4 0 0 0-7.6 0 5 5 0 0 0-1.5 3.6 5.2 5.2 0 0 0 1.5 3.7 4.9 4.9 0 0 0 4.1 1.3 4.2 4.2 0 0 0 2.6-1.6 3.7 3.7 0 0 0 .3-3.7z" />, "ThreadsIcon");
export const RedditIcon = make(<path d="M22 12c0-1.4-1.1-2.5-2.5-2.5a2.5 2.5 0 0 0-1.8.7 12 12 0 0 0-6-1.6l1-4.8 3.3.7a1.8 1.8 0 1 0 .2-1l-3.7-.8a.5.5 0 0 0-.6.4l-1.2 5.4a12 12 0 0 0-6.1 1.6A2.5 2.5 0 0 0 2 12a2.5 2.5 0 0 0 1.5 2.3 5 5 0 0 0-.1.9c0 3.4 3.8 6.1 8.6 6.1s8.6-2.7 8.6-6.1a5 5 0 0 0-.1-.9A2.5 2.5 0 0 0 22 12zM7 13.8a1.6 1.6 0 1 1 1.6 1.6 1.6 1.6 0 0 1-1.6-1.6zm8.7 4a5.6 5.6 0 0 1-3.7 1.1 5.6 5.6 0 0 1-3.7-1.1.4.4 0 0 1 .6-.6 4.9 4.9 0 0 0 3.1.9 4.9 4.9 0 0 0 3.1-.9.4.4 0 0 1 .6.6zm-.4-2.4a1.6 1.6 0 1 1 1.6-1.6 1.6 1.6 0 0 1-1.6 1.6z" />, "RedditIcon");

// Auth providers
export const GoogleIcon = make(<path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3zM12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5a6 6 0 0 1-9-3.1H3v2.6A10 10 0 0 0 12 22zM6.4 14a6 6 0 0 1 0-4V7.5H3a10 10 0 0 0 0 9zM12 6a5.4 5.4 0 0 1 3.8 1.5L18.7 4.6A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3 7.5L6.4 10A6 6 0 0 1 12 6z" />, "GoogleIcon");
export const GoogleColorIcon = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, className, ...props }, ref) => (
  <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
    <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5a6 6 0 0 1-9-3.1H3v2.6A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-4V7.5H3a10 10 0 0 0 0 9z" />
    <path fill="#EA4335" d="M12 6a5.4 5.4 0 0 1 3.8 1.5L18.7 4.6A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3 7.5L6.4 10A6 6 0 0 1 12 6z" />
  </svg>
));
GoogleColorIcon.displayName = "GoogleColorIcon";
export const AppleIcon = make(<path d="M17.05 20.28c-.98.95-2.05.8-3.08.36-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.36C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />, "AppleIcon");
export const GithubIcon = make(<path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.64.71 1.03 1.61 1.03 2.71 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z" />, "GithubIcon");

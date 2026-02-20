export function GetCreatedAt(date: Date | string | number, now?: Date): string {
   const created = date instanceof Date ? date : new Date(date);
   const currentTime = now || new Date();
   const diff = Math.max(0, currentTime.getTime() - created.getTime());
   const seconds = Math.floor(diff / 1000);

   if (seconds < 60) return `${seconds}s`;
   const minutes = Math.floor(seconds / 60);
   if (minutes < 60) return `${minutes}m`;
   const hours = Math.floor(minutes / 60);
   if (hours < 24) return `${hours}h`;
   const days = Math.floor(hours / 24);
   if (days < 7) return `${days}d`;
   const weeks = Math.floor(days / 7);
   if (weeks < 4) return `${weeks}w`;
   const months = Math.floor(days / 30);
   if (months < 12) return `${months}mo`;
   const years = Math.floor(days / 365);
   return `${years}y`;
// const plural = (n: number, singular: string, pluralForm?: string) =>
   // `${n} ${n === 1 ? singular : (pluralForm ?? singular + 's')}`;
// 
// if (seconds < 60) return plural(seconds, 'seconde', 'secondes');
// if (minutes < 60) return plural(minutes, 'minute', 'minutes');
// if (hours < 24) return plural(hours, 'heure', 'heures');
// if (days < 7) return plural(days, 'jour', 'jours');
// if (weeks < 4) return plural(weeks, 'semaine', 'semaines');
// if (months < 12) return plural(months, 'mois', 'mois');
// return plural(years, 'année', 'années');
}
import moment from "moment"
const ringtone = new Audio("/call-sound.mp3");

export const timeAgo = (date: string) => {

    const now = moment();
    const momentDate = moment(date);
    const diffInHours = now.diff(momentDate, 'hours');

    if (diffInHours < 24) {
        return momentDate.format('h:mm A');
    } else {
        const diffInDays = now.diff(momentDate, 'days');
        if (diffInDays < 30) {
            return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
        } else {
            const diffInMonths = now.diff(momentDate, 'months');
            if (diffInMonths < 12) {
                return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
            } else {
                const diffInYears = now.diff(momentDate, 'years');
                return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
            }
        }
    }
};

export const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes >= 1_000_000_000) {
        return `${(sizeInBytes / 1_000_000_000).toFixed(2)} GB`;
    } else if (sizeInBytes >= 1_000_000) {
        return `${(sizeInBytes / 1_000_000).toFixed(2)} MB`;
    } else if (sizeInBytes >= 1_000) {
        return `${(sizeInBytes / 1_000).toFixed(2)} KB`;
    } else {
        return `${sizeInBytes} bytes`;
    }
};

export const formatTime = (time: number) => {

    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes?.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

}

export const groupUsersByLetter = (users: any[]) => {

    const grouped: { [key: string]: any[] } = {};

    users.forEach(user => {
        const firstLetter = user.userName[0].toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(user);
    });

    return grouped;

};

export const copyText = async (text: string, fun?: any) => {

    if (!text || text.trim() === "") return

    navigator.clipboard.writeText(text).then(() => {
        if (fun) fun()
    }).catch((err) => console.error(err))

}

export const playRingtone = () => {
    ringtone.loop = true;
    ringtone.play().catch((error) => { console.error(error) });
};

export const stopRingtone = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
};
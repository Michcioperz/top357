export interface SourceFile {
    data: Data;
}

export interface Data {
    id:                    number;
    name:                  string;
    no:                    number;
    max_votes_per_user:    number;
    min_votes_per_user:    number;
    starts_at:             Date;
    ends_at:               Date;
    announcement_at:       Date;
    published_at:          Date;
    tracks:                Track[];
    capacity:              null;
    waiting_room_capacity: null;
    waiting_room_name:     null;
    results:               null;
    rules:                 string;
}

export interface Track {
    id:      number;
    name:    string;
    artist:  string;
    mp3_url: string;
}

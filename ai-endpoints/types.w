struct part {
    text: str;
}


pub struct History {
    role: str; // "user" | "model";
    parts: Array<part>;
}

pub struct HistoryList {
    histories: Array<History>;
}


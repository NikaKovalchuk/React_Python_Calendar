from enum import Enum


class EventRepeatEnum(Enum):

    NO = 0
    DAY = 1
    WEEK = 2
    MONTH = 3
    YEAR = 4


class EventNotificationEnum(Enum):

    NO = 0
    DAY = 1
    HOUR = 2
    HALF_HOUR = 3
    TEN_MINUTES = 4

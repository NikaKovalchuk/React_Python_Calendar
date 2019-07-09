from enum import Enum, IntEnum


class EventRepeatEnum(IntEnum):

    NO = 0
    DAY = 1
    WEEK = 2
    MONTH = 3
    YEAR = 4


class EventNotificationEnum(IntEnum):

    NO = 0
    DAY = 1
    HOUR = 2
    HALF_HOUR = 3
    TEN_MINUTES = 4

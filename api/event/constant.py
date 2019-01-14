from enum import Enum

class CycleType(Enum):
    NO = 0
    DAY = 1
    WEEK = 2
    MONTH = 3
    YEAR = 4

class ViewType(Enum):
    DAY = 0
    WEEK = 1
    MONTH = 2
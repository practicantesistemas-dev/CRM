from collections.abc import Sequence
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    model: type[ModelType]

    def __init__(self, db: Session):
        self.db = db

    def get(self, id_: int) -> ModelType | None:
        return self.db.get(self.model, id_)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        return self.db.scalars(select(self.model).offset(skip).limit(limit)).all()

    def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self, obj: ModelType) -> ModelType:
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, obj: ModelType) -> None:
        self.db.delete(obj)
        self.db.commit()
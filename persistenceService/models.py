from typing import Optional
import datetime
import uuid

from sqlalchemy import DateTime, Double, ForeignKeyConstraint, Index, PrimaryKeyConstraint, String, Text, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class Questions(Base):
    __tablename__ = 'questions'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='questions_pkey'),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[Optional[str]] = mapped_column(String(50))
    api_spec: Mapped[Optional[dict]] = mapped_column(JSONB)
    entry_point: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    answers: Mapped[list['Answers']] = relationship('Answers', back_populates='question',passive_deletes=True)
    unit_tests: Mapped[list['UnitTests']] = relationship('UnitTests', back_populates='question',passive_deletes=True)


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        UniqueConstraint('email', name='users_email_key')
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    answers: Mapped[list['Answers']] = relationship('Answers', back_populates='user')


class Answers(Base):
    __tablename__ = 'answers'
    __table_args__ = (
        ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', name='answers_question_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE', name='answers_user_id_fkey'),
        PrimaryKeyConstraint('id', name='answers_pkey'),
        UniqueConstraint('user_id', 'question_id', name='answers_user_id_question_id_key'),
        Index('idx_answers_question_id', 'question_id'),
        Index('idx_answers_user_id', 'user_id')
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    question_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    code_files: Mapped[dict] = mapped_column(JSONB, nullable=False)
    language: Mapped[Optional[str]] = mapped_column(String(50))
    framework: Mapped[Optional[str]] = mapped_column(String(50))
    status: Mapped[Optional[str]] = mapped_column(String(50), server_default=text("'submitted'::character varying"))
    score: Mapped[Optional[float]] = mapped_column(Double(53))
    test_results: Mapped[Optional[dict]] = mapped_column(JSONB)
    submitted_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    question: Mapped['Questions'] = relationship('Questions', back_populates='answers')
    user: Mapped['Users'] = relationship('Users', back_populates='answers')


class UnitTests(Base):
    __tablename__ = 'unit_tests'
    __table_args__ = (
        ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE', name='unit_tests_question_id_fkey'),
        PrimaryKeyConstraint('id', name='unit_tests_pkey'),
        Index('idx_unit_tests_question_id', 'question_id')
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    question_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False)
    test_files: Mapped[dict] = mapped_column(JSONB, nullable=False)
    language: Mapped[Optional[str]] = mapped_column(String(50))
    test_framework: Mapped[Optional[str]] = mapped_column(String(50))
    http_client: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    question: Mapped['Questions'] = relationship('Questions', back_populates='unit_tests')

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Make from '../../makes/entities/make.entity';

@Entity('models')
// составные уникальные индексы на уровне таблицы Models
@Index(['makeId', 'name'], { unique: true }) // у одной марки нельзя иметь две модели с одинаковым именем, но у разных марок одинаковое имя модели можно
@Index(['makeId', 'id'], { unique: true }) // делает правило еUNIQUE (make_id, id) для будущего составного FK (из vehicle_configurations - (make_id, model_id) -> models(make_id, id)). По факту TypeORM подставляет реальную колонку FK(make_id) благодаря @JoinColumn({ name: 'make_id' })
export default class Model {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ name: 'make_id', type: 'integer', nullable: false })
  makeId!: number;

  // в этой модели описывается связь "много моделей принадлежит одной марке"
  @ManyToOne(
    // у мнигих записей Model может быть одна и та же Make
    () => Make, // целевая сущность связи
    (make) => make.models, // обратная сторона связи в сущности Make (поле models)
    {
      nullable: false, // внешний ключ make_id обязателен, поэтому, модель нельзя сохранить без марки
      onDelete: 'RESTRICT', // нельзя удалить марку "Make", если на нее ссылаются модели. БД вернет ошибку и защитит от "висячих" ссылок.
      onUpdate: 'RESTRICT', // нельзя изменить значение ключа у Make, если есть связанные Model. На практике id почти не обновляют, но правило явно фиксирует поведение
    },
  )
  @JoinColumn({ name: 'make_id' })
  // JoinColumn - указывает что таблица в которой это указано является владеющей стороной связи ManyToOne
  // name: 'make_id' - указывает что в этой таблице внешний ключ из таблицы Make должен хранится в колонке с именем "make_id"
  make!: Make;
}

// Table models {
//   id integer [primary key, increment]
//   make_id integer [not null]
//   name varchar [not null]

//   indexes {
//     (make_id, name) [unique]
//     (make_id, id) [unique]
//   }
// }

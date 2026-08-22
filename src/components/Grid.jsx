import Card from './Card.jsx';

export default function Grid({ items, type, removable = false, getType }) {
  return (
    <div className="grid">
      {items.map((item) => {
        const itemType = getType ? getType(item) : type;
        return <Card key={`${itemType}-${item.id}`} item={item} type={itemType} removable={removable} />;
      })}
    </div>
  );
}

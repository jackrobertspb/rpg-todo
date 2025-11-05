export default function PlusIcon({ className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg height="24" width="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z" fill={color}/>
    </svg>
  );
}


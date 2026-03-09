"use client";
import { useParams } from 'next/navigation';

const EpisodePage = () => {
    const id = useParams().id;
  return (
    <div>EpisodePage {id}</div>
  )
}

export default EpisodePage
import Link from 'next/link';
import type { Post } from '@/models/Posts';

type PostsProps = {
  posts: Array<Post>,
};

const Posts = ({ posts }: PostsProps) => {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {posts.map(({ _id, title, date, category, tags }) => (
          <li key={String(_id)} >
            <Link href={`/posts/${_id}`} className="relative flex flex-col gap-1 tems-center px-8 py-10 shadow-md hover:shadow-xl hover:-translate-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-blue-400">{date}</span>
                {category && <div className="text-sm border-2 rounded-xl border-blue-300 text-sky-400 px-2">{category}</div>}
              </div>
              <span className="text-2xl overflow-hidden whitespace-nowrap text-ellipsis">{title}</span>
              {tags.length > 0 && (
                <div className="flex gap-2">
                  {tags.map((tag) => <div key={tag} className="text-sm text-blue-800">#{tag}</div>)}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Posts.getPageProps = () => {
  return {
    pageTitle: 'Posts',
  };
};

export default Posts;

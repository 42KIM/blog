import type EasyMDE from 'easymde';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { useRef, useState } from 'react';
import { APIService } from '@/apis';
import { useUser } from '@/lib/auth.service';
import { useDialog } from '@/lib/use-dialog';
import type { Post } from '@/models/Posts';

type PostEditProps = {
  post: Post,
  onSubmit: () => void,
};

const Editor = dynamic(
  () => import('@/components/common/Editor'),
  { ssr: false },
);

const PostEdit = ({ post, onSubmit }: PostEditProps) => {
  const router = useRouter();
  const [ title, setTitle ] = useState(post.title);
  const [ date, setDate ] = useState(post.date);
  const [ description, setDescription ] = useState(post.description);
  const [ category, setCategory ] = useState(post.category);
  const [ tags, setTags ] = useState(post.tags.join(' '));
  const editorRef = useRef<EasyMDE | null>(null);
  const { showDialog, showErrorDialog } = useDialog();
  const user = useUser();

  const handleDelete = async () => {
    try {
      await APIService.deletePosts({ _id: post._id });
      await APIService.revalidatePosts();
      showDialog({
        title: '완료',
        content: '게시물이 삭제되었습니다.',
        onConfirm: () => router.push('/posts'),
      });
    } catch (error) {
      showErrorDialog(error);
    }
  };

  const handleSubmit = async (event: MouseEvent) => {
    event.preventDefault();

    try {
      await APIService.updatePosts({
        _id: post._id,
        title,
        date,
        description,
        category,
        tags: tags.length > 0 ? tags.trim().split(' ') : [],
        content: editorRef.current?.value(),
      });
      await APIService.revalidatePostsDetail({ id: post._id });
      await APIService.revalidatePosts();
      showDialog({
        title: '완료',
        content: '게시물이 수정되었습니다.',
        onConfirm: onSubmit,
      });
    } catch (error) {
      showErrorDialog(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between text-sm text-blue-300">
        <Link href="/posts">
          <button>◀️ 목록</button>
        </Link>
        {user?.isAdmin && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                router.push(`/posts/${post._id}/edit`);
              }}
            >수정하기
            </button>
            <button onClick={handleDelete}>삭제하기</button>
          </div>
        )}
      </div>
      <form className="flex flex-col gap-2">
        <input
          className="h-10 text-lg border-2 p-2"
          placeholder="제목"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          className="w-3/12 border-2 p-2"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <input
          className="h-10 text-md border-2 p-2"
          placeholder="요약"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <input
          className="h-10 text-md border-2 p-2"
          placeholder="카테고리"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
        <Editor editorRef={editorRef} initialValue={post.content} />
        <input
          className="h-10 text-md border-2 p-2"
          placeholder="태그: 공백으로 구분"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
        />
        <button className="w-20 border-2 hover:bg-blue-200 self-end" onClick={handleSubmit}>수정 완료</button>
      </form>
    </div>
  );
};

export default PostEdit;

import type EasyMDE from 'easymde';
import dynamic from 'next/dynamic';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { APIService } from '@/apis';
import { useDialog } from '@/lib/use-dialog';

const Editor = dynamic(
  () => import('@/components/common/Editor'),
  { ssr: false },
);

const CreatePost = () => {
  const [ title, setTitle ] = useState('');
  const [ date, setDate ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ tags, setTags ] = useState('');
  const editorRef = useRef<EasyMDE>(null);
  const { showDialog, showErrorDialog } = useDialog();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await APIService.createPosts({
        title,
        date,
        description,
        category,
        content: editorRef.current?.value() || '',
        tags: tags.length > 0 ? tags.trim().split(' ') : [],
      });
      await APIService.revalidatePosts();
      showDialog({
        title: '완료',
        content: '게시물이 작성되었습니다.',
      });
    } catch (error) {
      showErrorDialog(error);
    }
  };

  return (
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
      <Editor editorRef={editorRef} />
      <input
        className="h-10 text-md border-2 p-2"
        placeholder="태그: 공백으로 구분"
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
        }}
      />
      <button className="w-20 border-2 hover:bg-blue-200 self-end" onClick={handleSubmit}>작성 완료</button>
    </form>
  );
};

export default CreatePost;

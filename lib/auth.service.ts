import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { accessCookieAtom, parseAccessCookie } from './access-cookie';
import { useEffect, useState } from 'react';
import { APIService } from '@/apis';

export const isSignedInAtom = atom<boolean>({
  key: 'isSignedIn',
  default: false,
});

export const userAtom = atom({
  key: 'user',
  default: null,
});

// TODO - type
export const useUser = () => useRecoilValue(userAtom);

export const useIsSignedIn = () => {
  const [ isSignedIn, setIsSignedIn ] = useState(false);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    setIsSignedIn(user !== null);
  }, [ user ]);

  return isSignedIn;
};

export const useAuthentication = () => {
  const parsedAccessCookie = parseAccessCookie();
  const [ accessCookie, setAccessCookie ] = useRecoilState(accessCookieAtom);
  const setUser = useSetRecoilState(userAtom);
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);

  useEffect(() => {
    if (parsedAccessCookie === null) {
      setUser(null);
      return;
    }

    setAccessCookie(parsedAccessCookie);

    const initUser = async () => {
      const user = await APIService.getUser();
      setUser(user);
    };
    // TODO - fix 중복호출
    initUser();
  }, [ parsedAccessCookie, accessCookie, setUser, setAccessCookie, setIsSignedIn ]);
};
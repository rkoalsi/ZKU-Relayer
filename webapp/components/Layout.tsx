import React, { ReactNode } from 'react';
import { Container } from '@chakra-ui/react';
import Header from './Header';

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  return (
    <div>
      <Header />
      <Container maxW='container.md' py='8'>
        {props.children}
      </Container>
    </div>
  );
}

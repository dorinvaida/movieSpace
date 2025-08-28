import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Carousel from './Carousel';

jest.mock('./Carousel.module.scss', () => ({
  section: 'section',
  title: 'title',
  wrap: 'wrap',
  arrow: 'arrow',
  prev: 'prev',
  next: 'next',
  chevron: 'chevron',
  track: 'track',
  card: 'card',
  link: 'link',
  poster: 'poster',
  caption: 'caption'
}));

const mockItems = [
  {
    id: '1',
    title: 'Test Movie 1',
    posterUrl: 'https://example.com/poster1.jpg'
  },
  {
    id: '2',
    title: 'Test Movie 2',
    posterUrl: 'https://example.com/poster2.jpg'
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Carousel', () => {
  beforeEach(() => {
    Element.prototype.scrollBy = jest.fn();
  });

  it('should render carousel with items', () => {
    renderWithRouter(<Carousel title="Action Movies" items={mockItems} />);
    
    expect(screen.getByText('Action Movies')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('should render movie posters', () => {
    renderWithRouter(<Carousel title="Test" items={mockItems} />);
    
    const posters = screen.getAllByRole('img');
    expect(posters).toHaveLength(2);
    expect(posters[0]).toHaveAttribute('src', 'https://example.com/poster1.jpg');
  });

  it('should navigate when buttons are clicked', () => {
    renderWithRouter(<Carousel title="Test" items={mockItems} />);
    
    const prevButton = screen.getByLabelText('Previous');
    const nextButton = screen.getByLabelText('Next');
    
    fireEvent.click(prevButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: -300,
      behavior: 'smooth'
    });
    
    fireEvent.click(nextButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalledWith({
      left: 300,
      behavior: 'smooth'
    });
  });

  it('should render movie links', () => {
    renderWithRouter(<Carousel title="Test" items={mockItems} />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/movie/1');
    expect(links[1]).toHaveAttribute('href', '/movie/2');
  });
});

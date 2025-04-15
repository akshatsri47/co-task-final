interface Text2Props {
    heading: string;
    subheading: string;
    className?: string;
  }
  
  export default function Text2({ heading, subheading, className = "" }: Text2Props) {
    return (
      <div className={`text-center ${className}`}>
        <h2 className="text-xl text-gray-500">{heading}</h2>
        <h1 className="text-4xl font-bold mt-2">{subheading}</h1>
      </div>
    );
  }
  
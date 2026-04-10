import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Course } from "../constants";
import { useNavigate } from "react-router-dom";

interface CourseCarouselProps {
  courses: Course[];
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ courses }) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const handleCourseClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="course-carousel">
      <Slider {...settings}>
        {courses.map((course) => (
          <div key={course.id} className="px-2">
            <div
              onClick={() => handleCourseClick(course.link)}
              className="bg-slate-50 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const placeholder = document.createElement("div");
                      placeholder.className =
                        "absolute inset-0 flex items-center justify-center text-4xl";
                      placeholder.textContent = "📚";
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .course-carousel .slick-dots {
          bottom: -30px;
        }
        .course-carousel .slick-dots li button:before {
          color: rgb(71 85 105);
        }
        .course-carousel .slick-dots li.slick-active button:before {
          color: rgb(34 197 94);
        }
        .course-carousel .slick-prev,
        .course-carousel .slick-next {
          z-index: 1;
        }
        .course-carousel .slick-prev {
          left: -25px;
        }
        .course-carousel .slick-next {
          right: -25px;
        }
        .course-carousel .slick-prev:before,
        .course-carousel .slick-next:before {
          color: rgb(71 85 105);
          font-size: 30px;
        }
      `}</style>
    </div>
  );
};

export default CourseCarousel;

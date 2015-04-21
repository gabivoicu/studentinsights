class PagesController < ApplicationController

  def about
  end

  def roster_demo
    @number_of_students = 12
    @students = []

    @number_of_students.times do 
      student = Student.new(Student.fake_data)
      @students << student
      student.student_results.build(StudentResult.fake_data)
    end
    
    @analyzer = RiskAnalyzer.new @students 
    @sorted_students = @analyzer.by_category
    @risk_categories = @analyzer.by_category.keys

    @homeroom = Homeroom.where(name: "Demo").first_or_create
    @homerooms_by_name = [@homeroom]
    render "students/index"
  end

end

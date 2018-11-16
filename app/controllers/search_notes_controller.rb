class SearchNotesController < ApplicationController
  before_action :ensure_authorized!

  # Assumes always sorting by descending time from a particular moment, limited
  # to what the caller asks for
  def query_json
    query = query_from_safe_params(params.permit(*[
      :text,
      :scope_key,
      :grade,
      :house,
      :event_note_type_id,
      :from_time,
      :limit
    ]))
    
    event_note_cards_json, all_results_size = SearchNotesQueries.new(current_educator).query(query)
    render json: {
      query: query,
      event_note_cards: event_note_cards_json,
      meta: {
        returned_size: event_note_cards_json.size,
        all_results_size: all_results_size
      }
    }
  end

  private
  # Defaults are set in the query object
  def query_from_safe_params(safe_params)
    {
      from_time: safe_params[:from_time],
      limit: safe_params[:limit],
      text: safe_params[:text],
      grade: safe_params[:grade],
      house: safe_params[:house],
      event_note_type_id: safe_params[:event_note_type_id],
      scope_key: safe_params[:scope_key]
    }
  end

  def ensure_authorized!
    raise Exceptions::EducatorNotAuthorized unless current_educator.labels.include?('enable_searching_notes')
  end
end

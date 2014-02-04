module NavigationHelpers

  def next_section
    return __slug_at_index(1)
  end

  def prev_section
    return __slug_at_index(-1)
  end


  def next_section_link(link_text=nil)
    next_slug = __slug_at_index(1)
    return "" if next_slug.nil?
    return section_link(next_slug, link_text, "next")
  end

  def prev_section_link(link_text=nil)
    prev_slug = __slug_at_index(-1)
    return "" if prev_slug.nil?
    return section_link(prev_slug, link_text, "prev")
  end

  def section_link(slug, link_text=nil, rel=nil)
    title = link_text || title_for_slug(slug) || ""
    url = url_for("/#{slug}")
    return "<a rel=#{rel} href=\"#{url}\">#{title}</a></li>"
  end

  def current_section_title
    title_for_slug(current_slug)
  end

  def current_slug
    __url_to_slug(current_page.url)
  end

  def title_for_slug(slug)
    nav_title_map.fetch(slug, nil)
  end

  def __url_to_slug(url)
    url.gsub(/\//, '')
  end

  def __slug_at_index(modifier)
    current_index = nav_ordering.index(current_slug)
    return nil if current_index.nil?
    new_index = current_index + modifier
    if (new_index < 0) || (new_index > (nav_ordering.length - 1))
      return nil
    end
    return nav_ordering[new_index]
  end

end
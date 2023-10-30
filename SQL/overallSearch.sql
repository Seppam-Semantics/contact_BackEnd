select A.contact_id, A.contact_name, A.contact_phone, A.contact_phone1, A.contact_phone2,
A.contact_email, A.contact_email1, A.contact_address, A.contact_address1,
(select C.tag_name from tags C  where C.tag_id = B.folder limit 1) as Folder,
(select C.tag_name from tags C  where C.tag_id = B.reltag limit 1) as reltag,
(select C.tag_name from tags C  where C.tag_id = B.tag1 limit 1) as Tag1,
(select C.tag_name from tags C  where C.tag_id = B.tag2 limit 1) as Tag2,
(select C.tag_name from tags C  where C.tag_id = B.tag3 limit 1) as Tag3,
(select C.tag_name from tags C  where C.tag_id = B.tag4 limit 1) as Tag4,
(select C.tag_name from tags C  where C.tag_id = B.tag5 limit 1) as Tag5,
(select C.tag_name from tags C  where C.tag_id = B.tag6 limit 1) as Tag6,
(select C.tag_name from tags C  where C.tag_id = B.tag7 limit 1) as Tag7,
(select C.tag_name from tags C  where C.tag_id = B.tag8 limit 1) as Tag8,
(select C.tag_name from tags C  where C.tag_id = B.tag9 limit 1) as Tag9,
(select C.tag_name from tags C  where C.tag_id = B.tag10 limit 1) as Tag10,
(select C.tag_name from tags C  where C.tag_id = B.tag11 limit 1) as Tag11,
(select C.tag_name from tags C  where C.tag_id = B.tag12 limit 1) as Tag12,
(select C.tag_name from tags C  where C.tag_id = B.tag13 limit 1) as Tag13,
(select C.tag_name from tags C  where C.tag_id = B.tag14 limit 1) as Tag14,
(select C.tag_name from tags C  where C.tag_id = B.tag15 limit 1) as Tag15,
(select C.tag_name from tags C  where C.tag_id = B.tag16 limit 1) as Tag16,
(select C.tag_name from tags C  where C.tag_id = B.tag17 limit 1) as Tag17,
(select C.tag_name from tags C  where C.tag_id = B.tag18 limit 1) as Tag18,
(select C.tag_name from tags C  where C.tag_id = B.tag19 limit 1) as Tag19,
(select C.tag_name from tags C  where C.tag_id = B.tag20 limit 1) as Tag20,
A.contact_status from contact A inner join contact_tag_linkage B on A.contact_id = B.contact_id
where A.contact_status = "Y" AND (A.contact_name like ? or
      A.contact_phone like ? or
      A.contact_phone1 like ? or
      A.contact_phone2 like ? or
      A.contact_email like ? or
      A.contact_email1 like ? or
(select C.tag_name from tags C  where C.tag_id = B.folder and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.reltag and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag1 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag2 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag3 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag4 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag5 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag6 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag7 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag8 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag9 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag10 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag11 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag12 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag13 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag14 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag16 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag17 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag18 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag19 and C.tag_status = "Y" limit 1) like ? or
(select C.tag_name from tags C  where C.tag_id = B.tag20 and C.tag_status = "Y" limit 1) like ?);